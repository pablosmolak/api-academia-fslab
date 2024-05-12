import { Validador, funcoesDeValidacao as funcoes } from "../utils/validation.js"
import { sendError } from "../utils/mensagens.js"
export default class usuarioValidation {
    static async criarUsuario(req, res, next) {

        let validador = new Validador(req.body)
        
        await validador.validacao("nome", funcoes.Obrigatorio(),funcoes.Length({min: 3, max: 200}))
        await validador.validacao("email", funcoes.Obrigatorio(), funcoes.Email(), funcoes.Unico({tabela: "usuario"}))
        await validador.validacao("senha", funcoes.Obrigatorio(), funcoes.Senha())
        
        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        return next()
    }

}