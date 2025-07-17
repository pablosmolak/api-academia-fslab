import { sendError } from "../utils/mensagens.js"

export async function EmailVerificadoMiddleware(req, res, next) {
    const user = req.user;

    if (!user.emailVerificado) {
        return sendError(res, 401, "Email não verificado!")
    }

    return next()
}