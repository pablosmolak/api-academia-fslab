import { Validador, funcoesDeValidacao as funcoes } from "../utils/validation.js"
import { sendError, messages } from "../utils/mensagens.js"
import { prisma } from "../config/prismaClient.js";
import bcript from "bcryptjs";


export default class AuthValidate {

    static async loginValidate(req, res, next) {
        let validador = new Validador(req.body)

        const { email, senha } = req.body

        await validador.validacao("email", funcoes.Obrigatorio(), funcoes.Email())
        await validador.validacao("senha", funcoes.Obrigatorio())

        if (validador.ehValido("email")) {
            let findUser = await prisma.usuario.findUnique({ 
                where: { email: email } ,
                include:{
                    Grupo:{
                        select: {
                            nome: true
                        }
                    }
                }
            })

            if (findUser === null) return sendError(res, 400, ["Usuário ou senha incorretos!"])

            if (!(await bcript.compare(senha, findUser.senha))) return sendError(res, 400, ["Usuário ou senha incorretos!"])

            if (!findUser.ativo) return sendError(res, 400, ["Usuário ou senha incorretos!"])

            req.usuario = findUser
        }

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        return next()
    }
}