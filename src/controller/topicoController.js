import { prisma } from "../config/prismaClient.js"
import messages, { sendError, sendResponse } from "../utils/mensagens.js"
import { topicoSchema } from "../schema/topicoSchema.js"

export default class TopicoController {

    static async criarTopico(req, res) {
        const erros = []

        const { titulo, cursoId } = topicoSchema.criarTopico.parse(req.body)

        const findCursos = await prisma.curso.findUnique({
            where: {
                id: cursoId
            }
        })

        if (findCursos === null) {
            erros.push(messages.validationGeneric.notFound("CursoId"))
        }


        if (erros.length > 0) return sendError(res, 422, erros)

        const quantidadeTopicos = await prisma.topico.count({
            where: {
                cursoId: cursoId
            }
        })

        const topicoCreate = await prisma.topico.create({
            data: {
                titulo: titulo,
                ordem: (quantidadeTopicos + 1),
                cursoId: cursoId
            }
        })

        return sendResponse(res, 201, topicoCreate)
    }

    static async listarTopicoPorID(req, res) {
        const { id } = req.params

        const findAula = await prisma.topico.findUnique({
            where: {
                id: id
            }
        })

        if (findAula === null) {
            return sendError(res, 404, [messages.validationGeneric.notFound("ID")])
        }

        return sendResponse(res, 200, findAula)
    }

    static async listarTopicoPorCurso(req, res) {
        const { cursoid } = req.params

        const findAulas = await prisma.topico.findMany({
            where: {
                cursoId: cursoid
            },
            orderBy: { ordem: 'asc' }
        })

        if (findAulas.length === 0) {
            return sendError(res, 404, [messages.validationGeneric.notFound("ID")])
        }

        return sendResponse(res, 200, findAulas)
    }

    static async deletarTopico(req, res) {
        const erros = []

        const { id } = req.params

        const findTopico = await prisma.topico.findUnique({
            where: {
                id: id
            }
        })

        if (!findTopico) {
            erros.push(messages.validationGeneric.mascCamp("Topico"))
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        await prisma.$transaction(async (prisma) => {

            await prisma.conteudoCurso.deleteMany({
                where: {
                    topicoId: id
                }
            })

            await prisma.topico.delete({
                where: {
                    id: id
                }
            })

            await prisma.topico.updateMany({
                where: {
                    cursoId: findTopico.cursoId,
                    ordem: {
                        gt: findTopico.ordem
                    }
                },
                data: {
                    ordem: {
                        decrement: 1
                    }
                }
            })
        })

        return sendResponse(res, 200, [])
    }

    static async alterarTopico(req, res) {
        const erros = []

        const { id } = req.params
        const { titulo, ordem } = topicoSchema.alterarTopico.parse(req.body)

        const findAula = await prisma.topico.findUnique({
            where: {
                id: id
            }
        })

        if (findAula === null) {
            erros.push(messages.validationGeneric.notFound("id"))
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        const totalAulas = await prisma.topico.count({
            where: {
                cursoId: findAula.cursoId
            }
        })

        const ordemAtual = findAula.ordem;
        let novaOrdem

        if (ordem) {
            novaOrdem = Math.max(1, Math.min(ordem, totalAulas))
        } else {
            novaOrdem = ordemAtual
        }

        await prisma.$transaction(async (prisma) => {
            if (ordemAtual !== novaOrdem) {
                if (novaOrdem > ordemAtual) {
                    await prisma.topico.updateMany({
                        where: {
                            cursoId: findAula.cursoId,
                            ordem: {
                                gt: ordemAtual,
                                lte: novaOrdem
                            }
                        },
                        data: {
                            ordem: {
                                decrement: 1
                            }
                        }
                    })
                } else if (novaOrdem < ordemAtual) {
                    await prisma.topico.updateMany({
                        where: {
                            cursoId: findAula.cursoId,
                            ordem: {
                                gte: novaOrdem,
                                lt: ordemAtual
                            }
                        },
                        data: {
                            ordem: {
                                increment: 1
                            }
                        }
                    })
                }
            }

            await prisma.topico.update({
                where: {
                    id: id
                },
                data: {
                    titulo: titulo,
                    ordem: novaOrdem
                }
            })
        })

        return sendResponse(res, 200, [])
    }
}