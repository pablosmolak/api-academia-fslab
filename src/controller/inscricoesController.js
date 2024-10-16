import { prisma } from "../config/prismaClient.js";
import messages, { sendError, sendResponse } from "../utils/mensagens.js";

export default class InscricoesController {
    static async criarInscricao(req, res) {
        const erros = []

        const { cursoid } = req.body

        if (!cursoid) {
            erros.push(messages.validationGeneric.fieldIsRequired("cursoid"))
        } else {
            const findCurso = await prisma.curso.findUnique({
                where: { id: cursoid }
            })

            if (findCurso === null) {
                erros.push(messages.validationGeneric.invalid("cursoid"))
            } else {
                const findInscricaoCurso = await prisma.inscricao.findFirst({
                    where: {
                        userId: req.user.id,
                        cursoId: cursoid,
                    }
                })

                if (findInscricaoCurso !== null) {
                    erros.push("Já existe uma inscrição neste curso para o usuário")
                }
            }
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        let inscricaoCriada
        await prisma.$transaction(async (prisma) => {

            inscricaoCriada = await prisma.inscricao.create({
                data: {
                    curso: {
                        connect: { id: cursoid }
                    },
                    usuario: {
                        connect: { id: req.user.id }
                    }
                },
            })

            await prisma.progressoCurso.create({
                data: {
                    userId: req.user.id,
                    cursoId: cursoid,
                    porcentagem: 0
                }
            })

        })

        return sendResponse(res, 201, inscricaoCriada);
    }

    static async listarInscricoes(req, res) {
        const { cursoId, usuarioId } = req.query

        const filtros = {}

        if (cursoId) filtros.where.cursoId = { contains: cursoId }
        if (usuarioId) filtros.where.userId = { contains: usuarioId }

        const inscricoes = await prisma.inscricao.findMany({
            ...filtros,
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

        return sendResponse(res, 200, inscricoes);
    }

    static async deletarInscricao(req, res) {
        const erros = []

        let { usuarioid, cursoid } = req.params

        if (!usuarioid) {
            erros.push(messages.validationGeneric.fieldIsRequired("usuarioid"))
        } else {
            const userExist = await prisma.usuario.findUnique({
                where: {
                    id: usuarioid
                }
            })

            if (userExist === null) {
                erros.push(messages.validationGeneric.notFound("usuarioid"))
            }
        }

        if (!cursoid) {
            erros.push(messages.validationGeneric.fieldIsRequired("cursoid"))
        } else {
            const cursoExist = await prisma.curso.findUnique({
                where: {
                    id: cursoid
                }
            })

            if (cursoExist === null) {
                erros.push(messages.validationGeneric.notFound("cursoid"))
            }
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        const inscricaoExist = await prisma.inscricao.findUnique({
            where: {
                userId_cursoId: {
                    userId: usuarioid,
                    cursoId: cursoid,
                },
            },
        })

        if (inscricaoExist === null) {
            return sendError(res, 422, [messages.validationGeneric.femCamp("Inscrição")])
        }

        await prisma.inscricao.delete({
            where: {
                userId_cursoId: {
                    userId: usuarioid,
                    cursoId: cursoid,
                },
            },
        })

        return sendResponse(res, 200, [])
    }
}