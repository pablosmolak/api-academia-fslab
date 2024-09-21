import { prisma } from "../config/prismaClient.js"
import { permissaoEnum } from "../utils/enums.js"
import { sendError } from "../utils/mensagens.js"

export const permissaoMiddleware = (grupos, modificadores) => async (req, res, next) => {

    const usuarioGrupo = req.user.grupo

    if (grupos.includes(usuarioGrupo)) {
        return next()
    }

    if (modificadores.includes(permissaoEnum.ProprioUsuario)) {
        if (req.user.id === req.params.id) {
            return next()
        }
    }


    return sendError(res, 403, ["Permissão insuficiente para executar a operação!"])
}