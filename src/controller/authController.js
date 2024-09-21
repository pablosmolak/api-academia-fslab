import jwt from "jsonwebtoken"
import messages, { sendError } from "../utils/mensagens.js"
import { prisma } from "../config/prismaClient.js"
import { validarEmail } from "../utils/validations.js"
import bcript from "bcryptjs"

export default class AuthController {
    static async logar(req, res) {
        const erros = []

        const {email,senha} = req.body

        if (!email) {
            erros.push(messages.validationGeneric.fieldIsRequired("E-mail"))
        } else {
            validarEmail(email,erros)
        }

        if (!senha) {
            erros.push(messages.validationGeneric.fieldIsRequired("Senha"))
        }

        if (erros.length > 0) sendError(res, 422, erros)

        const findUser = await prisma.usuario.findUnique({
            where: { email: email },
            include: {
                Grupo: {
                    select: {
                        nome: true
                    }
                }
            }
        })

        if (findUser === null) return sendError(res,401, ["Usuário ou senha incorretos!"])

        if (!(await bcript.compare(senha, findUser.senha))) return sendError(res,401, ["Usuário ou senha incorretos!"])

        if (!findUser.ativo) return sendError(res,401, ["Usuário ou senha incorretos!"])

        const token = {
            token: jwt.sign(
                {
                    id: findUser.id,
                    nome: findUser.nome,
                    email: findUser.email,
                    ativo: findUser.ativo,
                    grupo: findUser.Grupo.nome
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION }
            )
        }

        res.status(200).json(token)
    }
}