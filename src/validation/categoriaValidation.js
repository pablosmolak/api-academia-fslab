import { Validador, funcoesDeValidacao as func } from "../utils/validation.js";
import { sendError } from "../utils/mensagens.js";

export default class categoriaValidation {
    static async criarCategoria(req, res, next) {
        let validador = new Validador(req.body)
        await validador.validacao("nome", func.Obrigatorio(), func.Length({ min: 3, max: 200 }))
        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())
        return next()
    }
}