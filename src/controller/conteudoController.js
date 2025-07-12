import { prisma } from "../config/prismaClient.js"
import { conteudoCursoSchema } from "../schema/conteudoCursoSchema.js"
import { gruposEnum } from "../utils/enums.js"
import messages, { sendError, sendResponse } from "../utils/mensagens.js"
import { secondsToTime, timeToSeconds } from "../utils/utils.js"

export default class ConteudoController {
    static async criarConteudo(req, res) {
        const erros = [];

        const { topicoId, titulo, tipo, conteudo, cargaHoraria } = conteudoCursoSchema.criarConteudo.parse(req.body);

        const findTopico = await prisma.topico.findUnique({
            where: {
                id: topicoId
            },
            include: {
                curso: {
                    select: {
                        id: true,
                        cargaHoraria: true,
                        criador: true,
                        instrutores: true
                    }
                }
            }
        });

        if (findTopico === null) {
            return sendError(res, 422, {
                path: 'topicoId',
                message: messages.validationGeneric.notFound("topicoId")
            });
        }

        if (req.user.grupo === gruposEnum.Professores) {
            const userId = req.user.id;

            const isInstrutor = findTopico.curso.instrutores.some(instrutor => instrutor.userId === userId);
            const isCriador = userId === findTopico.curso.criador;

            if (!isCriador && !isInstrutor) {
                return sendError(res, 401, "Usuário sem permissão para criar um conteúdo para esse tópico do curso!");
            }
        }

        const conteudoExistente = await prisma.conteudoCurso.findFirst({
            where: {
                titulo,
                topicoId,
            },
        });

        if (conteudoExistente) {
            erros.push({
                path: 'titulo',
                message: 'Já existe um conteúdo com este título neste tópico.'
            });
        }

        //quando for add novos tipos de conteudo revalidar esse campo
        const regexYT = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

        if (!regexYT.test(conteudo)) {
            erros.push({
                path: 'conteudo',
                message: 'O conteúdo informado não é um link do youtube'
            });
        }

        if (erros.length > 0) return sendError(res, 422, erros);

        const quantidadeConteudo = await prisma.conteudoCurso.count({
            where: {
                topicoId: topicoId
            }
        });

        const cargaHorariaEmSegundos = await timeToSeconds(cargaHoraria);

        const cargaHorariaCursoAtual = findTopico.curso.cargaHoraria ?? 0;
        const novaCargaTotalCurso = (cargaHorariaCursoAtual + cargaHorariaEmSegundos);

        let createConteudo;
        await prisma.$transaction(async (prisma) => {

            await prisma.curso.update({
                where: { id: findTopico.cursoId },
                data: {
                    cargaHoraria: novaCargaTotalCurso
                }
            })

            createConteudo = await prisma.conteudoCurso.create({
                data: {
                    titulo: titulo,
                    topicoId: topicoId,
                    tipo: tipo,
                    cargaHoraria: cargaHorariaEmSegundos,
                    conteudo: conteudo,
                    ordem: (quantidadeConteudo + 1)
                }
            })
        })
        return sendResponse(res, 201, createConteudo)
    }

    static async buscarConteudoPorId(req, res) {
        const erros = []

        const { id } = conteudoCursoSchema.listarConteudo.parse(req.params)

        const findConteudos = await prisma.conteudoCurso.findUnique({
            where: {
                id: id
            }
        })

        if (findConteudos === null) {
            erros.push(messages.validationGeneric.notFound("ID"))
        }

        if (erros.length > 0) return sendError(res, 404, erros)

        return sendResponse(res, 200, { ...findConteudos, cargaHoraria: secondsToTime(findConteudos.cargaHoraria) })
    }

    static async buscarConteudoPorTopico(req, res) {
        const erros = []

        const { topicoid } = conteudoCursoSchema.listarConteudoPorTopico.parse(req.params)

        const findConteudos = await prisma.conteudoCurso.findMany({
            where: {
                topicoId: topicoid
            },
            orderBy: { ordem: 'asc' }
        })

        if (findConteudos.length === 0) {
            erros.push(messages.validationGeneric.notFound("ID"))
        }

        if (erros.length > 0) return sendError(res, 404, erros)

        const conteudosComTempoFormatado = findConteudos.map(conteudo => ({
            ...conteudo,
            cargaHoraria: secondsToTime(conteudo.cargaHoraria)
        }))

        return sendResponse(res, 200, conteudosComTempoFormatado)
    }

    static async alterarConteudo(req, res) {
        const erros = []

        const { id } = conteudoCursoSchema.listarConteudo.parse(req.params)
        const { titulo, tipo, conteudo, cargaHoraria, ordem } = conteudoCursoSchema.alterarConteudo.parse(req.body)

        const findConteudo = await prisma.conteudoCurso.findUnique({
            where: {
                id: id
            },
            include: {
                topico: {
                    include: {
                        curso: {
                            select: {
                                id: true,
                                cargaHoraria: true,
                                criador: true,
                                instrutores: true
                            }
                        }
                    }
                }
            }
        });

        if (findConteudo === null) {
            return sendError(res, 404, messages.validationGeneric.notFound("id"));
        }

        if (req.user.grupo === gruposEnum.Professores) {
            const userId = req.user.id;

            const isInstrutor = findConteudo.topico.curso.instrutores.some(instrutor => instrutor.userId === userId);
            const isCriador = userId === findConteudo.topico.curso.criador;

            if (!isCriador && !isInstrutor) {
                return sendError(res, 401, "Usuário sem permissão para alterar um conteúdo para esse tópico do curso!");
            }
        }

        if (titulo) {
            const conteudoExistente = await prisma.conteudoCurso.findFirst({
                where: {
                    titulo,
                    topicoId: findConteudo.topicoId,
                },
            });

            if (conteudoExistente && conteudoExistente.id !== findConteudo.id) {
                erros.push({
                    path: 'titulo',
                    message: 'Já existe um conteúdo com este título neste tópico.'
                });
            }
        }

        if (conteudo) {
            //quando for add novos tipos de conteudo revalidar esse campo
            const regexYT = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

            if (!regexYT.test(conteudo)) {
                erros.push({
                    path: 'conteudo',
                    message: 'O conteúdo informado não é um link do youtube'
                });
            }
        }

        if (erros.length > 0) return sendError(res, 422, erros);

        const cargaHorariaEmSegundos =
            cargaHoraria
                ? await timeToSeconds(cargaHoraria)
                : findConteudo.cargaHoraria;

        const cargaHorariaCursoAtual = findConteudo.topico.curso.cargaHoraria;
        const novaCargaTotalCurso = ((cargaHorariaCursoAtual - findConteudo.cargaHoraria) + cargaHorariaEmSegundos);

        const totalConteudos = await prisma.conteudoCurso.count({
            where: {
                topicoId: findConteudo.topicoId
            }
        })

        const ordemAtual = findConteudo.ordem;
        const novaOrdem = ordem ? Math.max(1, Math.min(ordem, totalConteudos)) : ordemAtual;

        await prisma.$transaction(async (prisma) => {
            if (ordemAtual !== novaOrdem) {
                if (novaOrdem > ordemAtual) {
                    await prisma.conteudoCurso.updateMany({
                        where: {
                            topicoId: findConteudo.topicoId,
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
                    await prisma.conteudoCurso.updateMany({
                        where: {
                            topicoId: findConteudo.topicoId,
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

            await prisma.conteudoCurso.update({
                where: {
                    id: id
                },
                data: {
                    titulo: titulo,
                    ordem: novaOrdem,
                    tipo: tipo,
                    conteudo: conteudo,
                    cargaHoraria: cargaHorariaEmSegundos
                }
            })

            await prisma.curso.update({
                where: { id: findConteudo.topico.cursoId },
                data: {
                    cargaHoraria: novaCargaTotalCurso
                }
            })
        })

        return sendResponse(res, 200, [])
    }

    static async deletarConteudo(req, res) {
        const erros = [];

        const { id } = req.params;

        const findConteudo = await prisma.conteudoCurso.findUnique({
            where: {
                id: id
            },
            include: {
                topico: {
                    include: {
                        curso: {
                            select: {
                                id: true,
                                cargaHoraria: true,
                                criador: true,
                                instrutores: true
                            }
                        }
                    }
                }
            }
        });


        if (findConteudo === null) {
            erros.push(messages.validationGeneric.mascCamp("Conteúdo"));
        }

        if (erros.length > 0) return sendError(res, 404, erros);

        if (req.user.grupo === gruposEnum.Professores) {
            const userId = req.user.id;

            const isInstrutor = findConteudo.topico.curso.instrutores.some(instrutor => instrutor.userId === userId);
            const isCriador = userId === findConteudo.topico.curso.criador

            if (!isCriador && !isInstrutor) {
                return sendError(res, 401, "Usuário sem permissão para deletar um conteúdo para esse tópico do curso!")
            }
        }

        const novaCargaTotalCurso = (findConteudo.topico.curso.cargaHoraria - findConteudo.cargaHoraria);

        await prisma.$transaction(async (prisma) => {

            await prisma.curso.update({
                where: { id: findConteudo.topico.cursoId },
                data: {
                    cargaHoraria: novaCargaTotalCurso
                }
            });

            await prisma.conteudoCurso.delete({
                where: {
                    id: id
                }
            });

            await prisma.conteudoCurso.updateMany({
                where: {
                    topicoId: findConteudo.topicoId,
                    ordem: {
                        gt: findConteudo.ordem
                    }
                },
                data: {
                    ordem: {
                        decrement: 1
                    }
                }
            });
        });

        return sendResponse(res, 200, []);
    }
}