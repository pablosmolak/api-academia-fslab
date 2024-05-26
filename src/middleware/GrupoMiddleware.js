import { prisma } from "../config/prismaClient.js";
import jwt from "jsonwebtoken"
import { sendError, messages} from "../utils/mensagens.js"

export function GrupoMiddleware(regra) {
    return async (req, res, next) => {
        let token = req.headers.authorization;

        [, token] = token.split(" ");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userid = decoded.id;

        const regrasDoUsuario = await prisma.usuario.findUnique({
            where: { id: userid },
            include: {
                Grupo: {
                    include: {
                        regrasOnGrupos: {
                            include: {
                                Regra: {
                                    select: {
                                        nome: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        const regras = []
        for(let regrasGrupos of regrasDoUsuario.Grupo.regrasOnGrupos){
            regras.push(regrasGrupos.Regra.nome)
        }

        if(regras.includes(regra)){
            return next()
        }

        sendError(res, 401, messages.auth.invalidPermission)


    }
}