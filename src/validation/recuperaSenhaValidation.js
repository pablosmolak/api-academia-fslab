import { Validador, funcoesDeValidacao as f } from "../utils/validation.js"
import { prisma } from "../config/prismaClient.js";
import { sendError, messages } from "../utils/mensagens.js"

export default class recuperaSenhaValidation {
    static async recuperaSenhaValidate(req, res, next) {
        let validador = new Validador(req.body)

        await validador.validacao("email", f.Obrigatorio(), f.Email())
        await validador.validacao("url", f.Obrigatorio())

        if (validador.ehValido("email")) {
            let findUser = await prisma.usuario.findUnique({
                where: { email: req.body.email }
            })

            if (findUser === null) return sendError(res, 400, ["Solicitação de alteração de senha enviada com sucesso!"])

            if (!findUser.ativo) return sendError(res, 400, ["Usuário inativo!"])

            req.body.usuario = findUser
        }

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        return next()
    }

    static async alteraSenhaValidate(req, res, next) {
        const { token, email } = req.query;
        const { senha } = req.body;

        let validador = new Validador({ ...req.body, token, senha, email })

        await validador.validacao("token", f.Obrigatorio())
        await validador.validacao("email", f.Obrigatorio(), f.Email())
        await validador.validacao("senha", f.Opcional(), f.Senha())

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        return next()
    }
}