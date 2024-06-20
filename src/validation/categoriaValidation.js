import { Validador, funcoesDeValidacao as func } from "../utils/validation.js";
import { sendError, messages } from "../utils/mensagens.js";
import jwt from "jsonwebtoken"

export default class categoriaValidation {
    static async criarCategoria(req, res, next) {
        
        let validador = new Validador(req.body)

        if (req.user.grupo !== "Administradores" && req.user.grupo !== "Ministrantes") {
            return sendError(res, 401, messages.auth.invalidPermission)
        }

        await validador.validacao("nome", func.Obrigatorio(), func.Unico({ tabela: "Categoria" }), func.Length({ min: 3, max: 200 }))

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        return next()
    }

    static async alterarCategoria(req, res, next) {
        req.body.id = req.params.id
        let validador = new Validador(req.body)

        if (req.user.grupo !== "Administradores" && req.user.grupo !== "Ministrantes") {
            return sendError(res, 401, messages.auth.invalidPermission)
        }

        await validador.validacao("id", func.Obrigatorio(), func.UUID({ message: messages.error.invalidID }), func.Existe({ tabela: "usuario" }))
        await validador.validacao("nome", func.Opcional(), func.Unico({ tabela: "Categoria" }), func.Length({ min: 3, max: 200 }))

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        return next()
    }

    static async deletarCategoria(req, res, next) {
        console.log(req.user)

        let validador = new Validador(req.params)

        if (req.user.grupo !== "Administradores" && req.user.grupo !== "Ministrantes") {
            return sendError(res, 401, messages.auth.invalidPermission)
        }

        await validador.validacao("id", func.Obrigatorio(), func.UUID({ message: messages.error.invalidID }), func.Existe({ tabela: "Categoria" }))

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        return next()
    }

    static async buscarCategoriaPorID(req, res, next) {
        let validador = new Validador(req.params)

        await validador.validacao("id", func.Obrigatorio(), func.UUID({ message: messages.error.invalidID }), func.Existe({ tabela: "Categoria",saveResult: true }))

        req.body.categoria = validador.body.Categoria

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        return next()
    }
}