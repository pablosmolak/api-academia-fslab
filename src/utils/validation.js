import messages from "./mensagens.js"
import { prisma } from "../config/prismaClient.js";

const obterValorDoPath = (objeto, path) => {
    if (!path.includes(".")) {
        return objeto[path]
    }

    let partes = path.split(".")
    let valorAtual = objeto
    for (let parte of partes) {
        if (valorAtual === undefined || valorAtual === null || valorAtual[parte] === undefined) return undefined

        valorAtual = valorAtual[parte]
    }

    return valorAtual
}

const definirValorNoPath = (objeto, path, valor) => {
    if (!path.includes(".")) {
        objeto[path] = valor
        return objeto
    }

    let partes = path.split(".")
    let ultimaParte = partes.pop()
    let valorAtual = objeto

    for (let parte of partes) {
        if (valorAtual[parte] === undefined || valorAtual[parte] === null) valorAtual[parte] = {};
        valorAtual = valorAtual[parte];
    }

    valorAtual[ultimaParte] = valor;
}

export class Validador {

    constructor(objetoBody) {
        if (objetoBody === undefined || typeof objetoBody !== "object" || objetoBody === null) {
            throw new Error("O Validator deve receber um objeto body com os valores a serem validados!");
        }

        this.validacoes = {}
        this.body = objetoBody
    }

    async validacao(path, ...funcoes) {

        let resultadoValidacao = new ResultadoValidacao(path, this.body)
        this.validacoes[path] = resultadoValidacao

        for (let funcao of funcoes) {
            let continuar = await funcao(resultadoValidacao.obterValor(), resultadoValidacao)

            if (continuar !== true) {
                resultadoValidacao.error = continuar
                return this
            }
        }
        return this
    }

    contemErros() {
        return Object.keys(this.validacoes).some((path) => !this.ehValido(path))
    }

    ehValido(path) {
        return path in this.validacoes
            && this.validacoes[path] !== undefined
            && this.validacoes[path].error === false;
    }

    obterValor(path) {
        if (this.validacoes[path] === undefined) return undefined;

        return this.validacoes[path].obterValor()
    }

    obterErros() {
        const errosFiltrados = Object.keys(this.validacoes).filter((path) => !this.ehValido(path))
        if (errosFiltrados.length > 0) {
            return errosFiltrados.map((path) => {
                return {
                    message: this.validacoes[path].error,
                    path: path
                }
            })
        } else {
            return []
        }
    }

    obterValoresLimpos() {
        let bodyLimpo = {}
        for (let path of Object.keys(this.validacoes)) {
            if (path.includes(".")) return

            let valor = this.validacoes[path].obterValor()
            if (valor !== undefined) {
                definirValorNoPath(bodyLimpo, path, valor)
            }

        }
        return bodyLimpo
    }
}

export class ResultadoValidacao {
    constructor(path, body) {
        this.path = path
        this.body = body
        this.error = false
    }

    temErro() {
        return this.error !== false
    }

    obterValor() {
        return obterValorDoPath(this.body, this.path)
    }

    definirValor1(valor) {
        return definirValorNoPath(this.body, this.path, valor)
    }
    definirValor(path,valor) {
        return definirValorNoPath(this.body, path, valor)
    }

    
    toString() {
        return JSON.stringify({
            path: this.path,
            value: definirValorNoPath(this.body, this.path),
            error: this.error
        });
    }
}

export class funcoesDeValidacao {
    static Obrigatorio = (opcoes = { allowNull: false}) => async (valor, resultadoValidacao) => {
        if (valor === undefined || (!opcoes.allowNull && (valor === null || valor === ""))) {
            return opcoes.mensagem || messages.validationGeneric.fieldIsRequired(resultadoValidacao.path).message
        }
        return true
    }

    static Opcional = (opcoes = { allowNull: false }) => async (valor) => {
        if (valor === undefined) return false
        if (!opcoes.allowNull && (valor === null || valor === "")) return false

        return true
    }

    static Unico = (opcoes = { tabela: false, query: false }) => async (valor, resultadoValidacao) => {
        if (opcoes.tabela === false) throw new Error("A função Unico da validação deve receber a tabela")

        let resultado = await prisma[opcoes.tabela].findMany(opcoes.query || { where: { [resultadoValidacao.path]: { contains: valor } } })
        if (resultado.length !== 0) {
            return opcoes.message || messages.validationGeneric.fieldIsRepeated(resultadoValidacao.path).message
        }

        return true
    }

    static UnicoVerificaNoID = (opcoes = { tabela: false, query: false }) => async (valor, resultadoValidacao) => {
        if (opcoes.tabela === false) throw new Error("A função Unico da validação deve receber a tabela")

        let resultado = await prisma[opcoes.tabela].findUnique(opcoes.query || { where: { [resultadoValidacao.path]: valor }  })

        if (!resultado || (resultado.id != undefined && (resultado.id === resultadoValidacao.body.id))) {
            return true
        }

        return opcoes.message || messages.validationGeneric.fieldIsRepeated(resultadoValidacao.path).message
    }

    static Existe = (opcoes = { tabela: false, query: false, saveResult: false  }) => async (valor, resultadoValidacao) => {
        if (opcoes.tabela === false) throw new Error("A função existe da validação deve receber a tabela")
        
        let resultado = await prisma[opcoes.tabela].findMany(opcoes.query || { where: { [resultadoValidacao.path]: { contains: valor } } })
        if (resultado.length === 0) {
            return opcoes.message || messages.validationGeneric.notFound(resultadoValidacao.path).message
        }

        if(opcoes.saveResult){
            resultadoValidacao.definirValor(opcoes.tabela,resultado)
        }

        return true
    }

    static Length = (opcoes = { min: false, max: false }) => async (valor, resultadoValidacao) => {
        if (!opcoes.min && !opcoes.max) throw new Error("A função de validação length deve receber um objeto com as propriedades min e/ou max")

        if (opcoes.min && valor.length < opcoes.min) {
            return opcoes.mensagem || messages.customValidation.lengthMenor(resultadoValidacao.path, opcoes.min).message
        }

        if (opcoes.max && valor.length > opcoes.max) {
            return opcoes.mensagem || messages.customValidation.lengthMaior(resultadoValidacao.path, opcoes.max).message
        }

        return true
    }

    static Email = (opcoes = {}) => async (valor) => {
        const valida = valor.split('@') // separa o email em 2

        if (valida.length < 2 || valida.length > 2) { // se não tiver @ ou mais de 1 @ da erro
            return opcoes.message || messages.customValidation.invalidMail
        }

        if (valida[0].includes(" ") || valida[1].includes(" ")) {  // verifica se não tem espaços em brancos
            return opcoes.message || messages.customValidation.invalidMail
        }

        if (!valida[1].includes('.') || valida[1].includes("..")) {  // verifica regras de pontos na segunda parte do email
            return opcoes.message || messages.customValidation.invalidMail
        }

        if (valida[0][0] === '.' || valida[0][valida[0].length - 1] === '.' ||
            valida[1][0] === '.' || valida[1][valida[1].length - 1] === '.') { // verifica regras de pontos no email

            return opcoes.message || messages.customValidation.invalidMail
        }

        return true
    }

    static Senha = (opcoes = {}) => (valor, resultadoValidacao) => {
        const maisculas = /[A-Z]/
        const minusculas = /[a-z]/
        const numeros = /[0-9]/
        const especial = /[!|@|#|$|%|^&|*|(|)|_|-|=|+|:|;]/

        const erros = []
        const senha = String(valor)

        if (senha.length < 8) {
            erros.push("A senha deve conter no mínimo 8 caracteres!")
        }

        if (!maisculas.test(senha)) {
            erros.push("A senha precisa conter ao menos 1 letra maiúscula!")
        }

        if (!minusculas.test(senha)) {
            erros.push("A senha precisa conter ao menos 1 letra minúscula!")
        }

        if (!numeros.test(senha)) {
            erros.push("A senha precisa conter ao menos 1 número!")
        }

        if (!especial.test(senha)) {
            erros.push("A senha deve conter ao menos 1 caractere especial!")
        }

        if (erros.length > 0) return erros

        return true
    }

    static Regex = (opcoes = { regex: false }) => async (valor, resultadoValidacao) => {
        if (opcoes.regex === false) throw new Error("A função de validação regex deve receber um objeto com a propriedade regex");
        if (!opcoes.regex.test(valor)) {
            return opcoes.message || messages.validationGeneric.invalidInputFormatForField(resultadoValidacao.path).message;
        }

        return true;
    }

    static UUID = (opcoes = {}) => async (valor, resultadoValidacao) => {
        return funcoesDeValidacao.Regex({
            regex: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
            message: opcoes.message
        })(valor, resultadoValidacao)
    }

}