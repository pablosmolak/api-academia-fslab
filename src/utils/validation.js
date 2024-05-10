import messages from "./mensagens.js"

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
        return objeto[path] = valor
    }

    let partes = path.split(".")
    let ultimaParte = partes.pop()
    let valorAtual = objeto

    for (let parte of partes) {
        if (valorAtual[parte] === undefined || valorAtual[partw] === null) valorAtual[parte] = {};
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

    obterValor(path){
        if(this.validacoes[path] === undefined) return undefined;

        return this.validacoes[path].obterValor()
    }

    obterErros() {
        const errosFiltrados = Object.keys(this.validacoes).filter((path) => !this.ehValido(path))
        if (errosFiltrados.length>0){
            return errosFiltrados.map((path) => {
                return {
                    message: this.validacoes[path].error,
                    path: path
                }
            })
        }else{
            return []
        }
    }

    obterValoresLimpos(){
        let bodyLimpo = {}
        for (let path of Object.keys(this.validacoes)){

            if(path.includes(".")) return

            let valor = this.validacoes[path].obterValor()
            if(valor !== undefined){
                definirValorNoPath(bodyLimpo,path,valor)
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

    definirValor(valor) {
        definirValorNoPath(this.body, this.path, valor)
    }

    toString() {
        return JSON.stringify({
            path: this.path,
            value: getValueByPath(this.body, this.path),
            error: this.error
        });
    }
}


export class funcoesDeValidacao{
    static obrigatorio = (opcoes = {allowNull: false}) => async (valor, resultadoValidacao) => {
        if(valor === undefined || (!opcoes.allowNull && (valor === null || valor === ""))){
            return opcoes.message || messages.validationGeneric.fieldIsRequired(resultadoValidacao.path).message
        }
        return true
    }
}