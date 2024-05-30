import { sendError, messages } from "../utils/mensagens.js"
import jwt from "jsonwebtoken"
import { prisma } from "../config/prismaClient.js";

export async function AuthMiddleware(req, res, next) {
    let token = req.headers.authorization

    if (!token) { return sendError(res, 498, messages.auth.invalidToken) }

    [, token] = token.split(" ")

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodificado) => {
        if (err) return sendError(res, 498, messages.auth.invalidToken)

        let user = await prisma.usuario.findUnique({
            where: {
                id: decodificado.id
            }
        })

        if (!user) {
            return sendError(res, 498, messages.auth.invalidToken)
        }

        req.user_id = decodificado.id

        return next()
    })
}