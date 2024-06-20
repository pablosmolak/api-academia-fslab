import { Validador, funcoesDeValidacao as funcoes } from "../utils/validation.js"
import { sendError, messages } from "../utils/mensagens.js"

export default class usuarioValidation {
    static async criarUsuario(req, res, next) {

        let validador = new Validador(req.body)

        await validador.validacao("nome", funcoes.Obrigatorio(), funcoes.Length({ min: 3, max: 200 }))
        await validador.validacao("email", funcoes.Obrigatorio(), funcoes.Email(), funcoes.Unico({ tabela: "usuario" }))
        await validador.validacao("senha", funcoes.Obrigatorio(), funcoes.Senha())

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        return next()
    }

    static async alterarUsuario(req, res, next) {
        req.body.id = req.params.id
        let validador = new Validador(req.body)

        await validador.validacao("id", funcoes.Obrigatorio(), funcoes.UUID({ message: messages.error.invalidID }), funcoes.Existe({ tabela: "usuario" }))
        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())


        if (req.user.id !== req.params.id && req.user.grupo !== "Administradores") {
            return sendError(res, 401, messages.auth.invalidPermission)
        }

        await validador.validacao("nome", funcoes.Opcional(), funcoes.Length({ min: 3, max: 200 }))
        await validador.validacao("email", funcoes.Opcional(), funcoes.Email(), funcoes.UnicoVerificaNoID({ tabela: "usuario" }))
        await validador.validacao("senha", funcoes.Opcional(), funcoes.Senha())

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        return next()
    }

    static async deletarUsuario(req, res, next) {
        req.body.id = req.params.id
        let validador = new Validador(req.body)

        await validador.validacao("id", funcoes.Obrigatorio(), funcoes.UUID({ message: messages.error.invalidID }), funcoes.Existe({ tabela: "usuario" }))

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        if (req.user.id !== req.params.id && req.user.grupo !== "Administradores") {
            return sendError(res, 401, messages.auth.invalidPermission)
        }

        return next()
    }

    static async buscarUsuario(req, res, next) {
        let validador = new Validador(req.params)

        await validador.validacao("id", funcoes.Obrigatorio(), funcoes.UUID({ message: messages.error.invalidID }), funcoes.Existe({ tabela: "usuario" }))

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        return next()
    }
}

