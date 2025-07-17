import bcript from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../config/prismaClient.js"
import { loginSchema } from "../schema/loginSchema.js"
import messages, { sendError, sendResponse } from "../utils/mensagens.js"


export default class AuthController {
    static async logar(req, res) {
        const erros = []

        const { email, senha } = loginSchema.logar.parse(req.body)

        if (erros.length > 0) return sendError(res, 422, erros)

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

        if (findUser === null) return sendError(res, 401, ["Usuário ou senha incorretos!"])

        const senhaValida = await bcript.compare(senha, findUser.senha)

        if (!senhaValida) return sendError(res, 401, ["Usuário ou senha incorretos!"])

        if (!findUser.ativo) return sendError(res, 401, ["Usuário ou senha incorretos!"])

        const token = jwt.sign(
            {
                id: findUser.id,
                name: findUser.nome,
                email: findUser.email,
                ativo: findUser.ativo,
                grupo: findUser.Grupo.nome,
                emailVerificado: findUser.emailVerificado
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        )

        const payload = jwt.decode(token);

        return sendResponse(res, 200, {
            token: token,
            payload: payload
        })
    }

    static async checkInfoLogin(req, res) {
        const user = req.user

        const findUser = await prisma.usuario.findUnique({
            where: {
                id: user.id
            },
            include: {
                Grupo: {
                    select: {
                        nome: true
                    }
                }
            }
        })

        const payload = {
            ...user.tokenPayload,
            "name": findUser.nome,
            "email": findUser.email,
            "ativo": findUser.ativo,
            "grupo": findUser.Grupo.nome,
            "emailVerificado": findUser.emailVerificado,
        }

        return sendResponse(res, 200, { payload })
    }


}