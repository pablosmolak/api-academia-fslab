import { Validador, funcoesDeValidacao as func } from "../utils/validation.js";
import { sendError } from "../utils/mensagens.js";

export default class cursoValidation {
    static async criarCurso(req, res, next) {
        let validador = new Validador(req.body)
        await validador.validacao("nome", func.Obrigatorio(), func.Length({ min: 3, max: 200 }))
        await validador.validacao("descricao", func.Opcional(), func.Length({ min: 3, max: 200 }))
        await validador.validacao("categoria", func.Obrigatorio())
        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())
        return next()
    }
}