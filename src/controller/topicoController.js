import { prisma } from "../config/prismaClient.js"
import { topicoSchema } from "../schema/topicoSchema.js"
import { gruposEnum } from "../utils/enums.js"
import messages, { sendError, sendResponse } from "../utils/mensagens.js"

export default class TopicoController {

    static async criarTopico(req, res) {
        const erros = []

        const { titulo, cursoId } = topicoSchema.criarTopico.parse(req.body)

        const findCursos = await prisma.curso.findUnique({
            where: {
                id: cursoId
            },
            include: {
                instrutores: true
            }
        })

        if (findCursos === null) {
            return sendError(res, 422, {
                path: 'cursoId',
                message: messages.validationGeneric.notFound("CursoId")
            })
        }

        if (req.user.grupo === gruposEnum.Professores) {
            const userId = req.user.id;

            const isInstrutor = findCursos.instrutores.some(instrutor => instrutor.userId === userId);
            const isCriador = userId === findCursos.criador

            if (!isCriador && !isInstrutor) {
                return sendError(res, 401, "Usuário sem permissão para criar um topico para o curso!")
            }
        }

        const conteudoExistente = await prisma.topico.findFirst({
            where: {
                titulo,
                cursoId: cursoId
            },
        });

        if (conteudoExistente) {
            erros.push({
                path: 'titulo',
                message: 'Já existe um tópico com este título neste curso.'
            });
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

        const findTopico = await prisma.topico.findUnique({
            where: {
                id: id
            }
        })

        if (findTopico === null) {
            return sendError(res, 404, [messages.validationGeneric.notFound("ID")])
        }

        return sendResponse(res, 200, findTopico)
    }

    static async listarTopicoPorCurso(req, res) {
        const { cursoid } = req.params

        const findTopicos = await prisma.topico.findMany({
            where: {
                cursoId: cursoid
            },
            orderBy: { ordem: 'asc' }
        })

        if (findTopicos.length === 0) {
            return sendError(res, 404, [messages.validationGeneric.notFound("ID")])
        }

        return sendResponse(res, 200, findTopicos)
    }

    static async deletarTopico(req, res) {
        const erros = []

        const { id } = req.params

        const findTopico = await prisma.topico.findUnique({
            where: {
                id: id
            },
            include: {
                curso: {
                    select: {
                        cargaHoraria: true,
                        criador: true,
                        instrutores: {
                            select: {
                                userId: true
                            }
                        }
                    }
                }
            }
        })

        if (!findTopico) {
            erros.push(messages.validationGeneric.mascCamp("Topico"))
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        if (req.user.grupo === gruposEnum.Professores) {
            const userId = req.user.id;

            const isInstrutor = findTopico.curso.instrutores.some(instrutor => instrutor.userId === userId);
            const isCriador = userId === findTopico.curso.criador

            if (!isCriador && !isInstrutor) {
                return sendError(res, 401, "Usuário sem permissão para deletar o tópico!")
            }
        }

        const somaCargaHoraria = await prisma.conteudoCurso.aggregate({
            _sum: {
                cargaHoraria: true,
            },
            where: {
                topicoId: id,
            },
        });

        const totalCargaHoraria = somaCargaHoraria._sum.cargaHoraria ?? 0;

        const novaCargaTotalCurso = (findTopico.curso.cargaHoraria - totalCargaHoraria);

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

            await prisma.curso.update({
                where: {
                    id: findTopico.cursoId
                },
                data: {
                    cargaHoraria: novaCargaTotalCurso
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

        const findTopico = await prisma.topico.findUnique({
            where: {
                id: id
            },
            include: {
                curso: {
                    include: {
                        instrutores: true
                    }
                }
            }
        })

        if (findTopico === null) {
            return sendError(res, 422, messages.validationGeneric.notFound("id"))
        }

        if (req.user.grupo === gruposEnum.Professores) {
            const userId = req.user.id;

            const isInstrutor = findTopico.curso.instrutores.some(instrutor => instrutor.userId === userId);
            const isCriador = userId === findTopico.curso.criador

            if (!isCriador && !isInstrutor) {
                return sendError(res, 401, "Usuário sem permissão para alterar o tópico!")
            }
        }

        if (titulo) {
            const conteudoExistente = await prisma.topico.findFirst({
                where: {
                    titulo,
                    cursoId: findTopico.cursoId,
                },
            });

            if (conteudoExistente && conteudoExistente.id !== findTopico.id) {
                erros.push({
                    path: 'titulo',
                    message: 'Já existe um tópico com este título neste curso.'
                });
            }
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        const totalTopicos = await prisma.topico.count({
            where: {
                cursoId: findTopico.cursoId
            }
        })

        const ordemAtual = findTopico.ordem;
        let novaOrdem

        if (ordem) {
            novaOrdem = Math.max(1, Math.min(ordem, totalTopicos))
        } else {
            novaOrdem = ordemAtual
        }

        await prisma.$transaction(async (prisma) => {
            if (ordemAtual !== novaOrdem) {
                if (novaOrdem > ordemAtual) {
                    await prisma.topico.updateMany({
                        where: {
                            cursoId: findTopico.cursoId,
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
                            cursoId: findTopico.cursoId,
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