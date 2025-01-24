import { prisma } from "../config/prismaClient.js";
import { certificadoSchema } from "../schema/certificadoSchema.js";
import messages, { sendError, sendResponse } from "../utils/mensagens.js";

export default class CertificadoController {

    static async listarCertificados(req, res) {

        const certificados = await prisma.certificado.findMany({
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                curso: {
                    select: {
                        id: true,
                        nome: true,
                        descricao: true
                    }
                }
            }
        });

        return sendResponse(res, 200, certificados);
    }

    static async listarCertificadosDoUsuario(req, res) {
        const { userId } = certificadoSchema.buscarCertificadoPorUsuario.parse(req.params)

        const findUser = await prisma.usuario.findUnique({
            where: {
                id: userId
            }
        })

        if (!findUser) {
            return sendError(res, 422, { path: "userId", message: messages.validationGeneric.notFound("id do usuário") });
        }

        const certificado = await prisma.certificado.findMany({
            where: {
                userId
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                curso: {
                    select: {
                        id: true,
                        nome: true,
                        descricao: true
                    }
                }
            }
        })

        return sendResponse(res, 200, certificado)
    }

    static async listarCertificadosDoCursoDoUsuarioLogado(req, res) {
        const userId = req.user.id

        const { cursoId } = certificadoSchema.buscarCertificado.parse(req.params)

        const findCurso = await prisma.curso.findUnique({
            where: {
                id: cursoId,
            }
        })

        if (!findCurso) {
            return sendError(res, 422, { path: "cursoId", message: messages.validationGeneric.notFound("id do curso") });
        }

        const certificado = await prisma.certificado.findMany({
            where: {
                cursoId,
                userId
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                curso: {
                    select: {
                        id: true,
                        nome: true,
                        descricao: true
                    }
                }
            }
        })

        return sendResponse(res, 200, certificado)
    }

    static async validarCertificado(req, res) {
        const { validador } = req.params

        const certificado = await prisma.certificado.findUnique({
            where: {
                validador: validador
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                curso: {
                    select: {
                        id: true,
                        nome: true,
                        descricao: true
                    }
                }
            }
        })

        return sendResponse(res, 200, certificado);
    }
}