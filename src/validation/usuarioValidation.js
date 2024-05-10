import { Validador, funcoesDeValidacao as funcoes } from "../utils/validation.js"
import { sendError } from "../utils/mensagens.js"
export default class usuarioValidation {
    static async criarUsuario(req, res, next) {

        let validador = new Validador(req.body)
        
        await validador.validacao("nome", funcoes.obrigatorio())
        await validador.validacao("email", funcoes.obrigatorio())
        await validador.validacao("senha", funcoes.obrigatorio())
        
        if (validador.contemErros()) return sendError(res, 422, validador.obterErros());

        return next()
    }

}