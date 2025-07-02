import { prisma } from "../config/prismaClient.js";
import messages, { sendError, sendResponse } from "../utils/mensagens.js";
import { inscricaoSchema } from "../schema/inscricaoSchema.js";
import { pagination } from "../utils/pagination.js";

export default class InscricoesController {
    static async criarInscricao(req, res) {
        const erros = []

        const { cursoId } = inscricaoSchema.criarInscricao.parse(req.body)

        const userid = req.user.id

        const findCurso = await prisma.curso.findUnique({
            where: {
                id: cursoId,
                publicado: true
            },
            include: {
                topicos: {
                    include: {
                        conteudos: {
                            orderBy: { ordem: 'asc' }
                        }
                    },
                    orderBy: { ordem: 'asc' }
                },
            }
        })

        if (findCurso === null) {
            erros.push('Nenhum curso publicado encontrado com esse ID')
        } else {

            if (findCurso.topicos.length === 0) {
                erros.push('Não é possivel se inscrever em um curso sem tópicos')
            }

            const findInscricaoCurso = await prisma.inscricao.findFirst({
                where: {
                    userId: userid,
                    cursoId: cursoId,
                }
            })

            if (findInscricaoCurso !== null) {
                erros.push("Já existe uma inscrição neste curso para o usuário")
            }
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        const topicoAtual = findCurso.topicos?.find(topico => topico.ordem === 1)
        const atividadeAtual = topicoAtual.conteudos?.find(conteudo => conteudo.ordem === 1)?.id

        let inscricaoCriada
        await prisma.$transaction(async (prisma) => {

            inscricaoCriada = await prisma.inscricao.create({
                data: {
                    curso: {
                        connect: { id: cursoId }
                    },
                    usuario: {
                        connect: { id: userid }
                    }
                },
            })

            await prisma.progressoCurso.create({
                data: {
                    userId: userid,
                    cursoId: cursoId,
                    porcentagem: 0,
                    atividadeAtual: atividadeAtual
                }
            })

        })

        return sendResponse(res, 201, inscricaoCriada);
    }

    static async listarInscricoes(req, res) {
        const filtros = { where: {} }

        const { cursoId, usuarioId, pagina = 1, limite = 10 } = req.query

        if (cursoId) filtros.where.cursoId = { contains: cursoId }
        if (usuarioId) filtros.where.userId = { contains: usuarioId }

        const paginacao = await pagination('inscricao', pagina, limite, filtros)

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
            },
            skip: paginacao.skip,
            take: paginacao.take
        });

        return sendResponse(res, 200, inscricoes,
            { pagina: paginacao.paginaAtual, totalPaginas: paginacao.totalPaginas, limite: paginacao.take }
        );
    }

    static async listarInscricoesDoUsuarioLogado(req, res) {

        const usuario = req.user.id

        const inscricoes = await prisma.inscricao.findMany({
            where: {
                userId: usuario
            },
            include: {
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

    static async listarInscricoesDoUsuarioLogadoPorIdDeCurso(req, res) {

        const usuario = req.user.id
        
        const { cursoId } = inscricaoSchema.listarInscricaoPorCurso.parse(req.params)

        const findCurso = await prisma.curso.findUnique({
            where: {
                id: cursoId,
            }
        });

        if (!findCurso) {
            return sendError(res, 422, { path: "cursoId", message: messages.validationGeneric.notFound("id do curso") });
        }

        const inscricoes = await prisma.inscricao.findMany({
            where: {
                userId: usuario,
                cursoId: cursoId
            },
            include: {
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

    static async deletarInscricaoDoUsuarioLogadoPorIdDeCurso(req, res) {

        const { cursoId } = inscricaoSchema.listarInscricaoPorCurso.parse(req.params)
        const usuarioid = req.user.id

        const cursoExist = await prisma.curso.findUnique({
            where: {
                id: cursoId
            }
        })

        if (cursoExist === null) {
            return sendError(res, 422, [messages.validationGeneric.notFound("cursoId")])
        }

        const inscricaoExist = await prisma.inscricao.findUnique({
            where: {
                userId_cursoId: {
                    userId: usuarioid,
                    cursoId: cursoId,
                },
            },
            include: {
                progresso: {
                    select: {
                        porcentagem: true
                    }
                }
            }
        })

        if (inscricaoExist === null) {
            return sendError(res, 422, [messages.validationGeneric.femCamp("Inscrição")])
        }

        if (inscricaoExist.progresso.porcentagem === 100) {
            return sendError(res, 422, ["Você não pode excluir uma inscrição de um curso que você já finalizou!"])
        }

        await prisma.$transaction(async (prisma) => {

            await prisma.progressoCurso.delete({
                where: {
                    userId_cursoId: {
                        userId: usuarioid,
                        cursoId: cursoId,
                    },
                },
            })

            await prisma.inscricao.delete({
                where: {
                    userId_cursoId: {
                        userId: usuarioid,
                        cursoId: cursoId,
                    },
                },
            })

        })

        return sendResponse(res, 200, [])
    }
}