import { prisma } from "../config/prismaClient.js";
import messages, { sendError, sendResponse } from "../utils/mensagens.js";
import { progressoSchema } from "../schema/progressoCursoSchema.js";

export default class ProgressoController {
    static async listarProgresso(req, res) {
        const resp = await prisma.progressoCurso.findMany()
        sendResponse(res, 200, resp)
    }

    static async listarProgressoDoUsuarioNoCurso(req, res) {
        const userId = req.user.id

        const { cursoId } = progressoSchema.listarProgresso.parse(req.params)

        const findCurso = await prisma.curso.findUnique({
            where: {
                id: cursoId,
            }
        });

        if (!findCurso) {
           return sendError(res, 422, { path: "cursoId", message: messages.validationGeneric.notFound("id do curso") });
        }

        const progresso = await prisma.progressoCurso.findMany({
            where: {
                cursoId,
                userId
            }
        })

        if(progresso.length === 0){
           return sendError(res, 404, "Nenhum progresso encontrado nesse curso para esse usuário!");
        }

       return sendResponse(res, 200, progresso)
    }

    static async finalizarAtividade(req, res) {

        const { conteudoid } = progressoSchema.finalizarAtividade.parse(req.params)

        const conteudo = await prisma.conteudoCurso.findUnique({
            where: {
                id: conteudoid
            },
            select: {
                topico: {
                    select: {
                        curso: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            }
        })

        if (!conteudo) {
            return sendError(res, 422, { path: "conteudoid", message: "Não existe conteúdo com o ID informado!" })
        }

        const cursoid = conteudo?.topico.curso.id

        const inscricao = await prisma.inscricao.findUnique({
            where: {
                userId_cursoId: {
                    userId: req.user.id,
                    cursoId: cursoid
                }
            }
        })

        if (inscricao === null) {
            return sendError(res, 422, { path: "conteudoid", message: "Usuário não inscrito no curso" })
        }

        const progresso = await prisma.progressoCurso.findUnique({
            where: {
                userId_cursoId: {
                    userId: req.user.id,
                    cursoId: cursoid,
                },
            },
            select: {
                atividadesConcluidas: true,
                atividadeAtual: true,
            },
        });

        let atividadesConcluidas = [];
        if (progresso && progresso.atividadesConcluidas) {
            atividadesConcluidas = progresso.atividadesConcluidas
        }

        if (!atividadesConcluidas.includes(conteudoid)) {
            atividadesConcluidas.push(conteudoid);

        } else {
            return sendError(res, 422, { path: "conteudoid", message: "O conteúdo informado já estava concluído!" })
        }

        const topicos = await prisma.topico.findMany({
            where: { cursoId: cursoid },
            include: {
                conteudos: {
                    orderBy: { ordem: 'asc' },
                },
            },
            orderBy: { ordem: 'asc' },
        })

        let atividadeAtual = null;

        for (const topico of topicos) {
            for (const conteudo of topico.conteudos) {
                if (!atividadesConcluidas.includes(conteudo.id)) {
                    atividadeAtual = conteudo.id;
                    break;
                }
            }
            if (atividadeAtual) break;
        }

        const totalAtividades = topicos.reduce((acc, topico) => acc + topico.conteudos.length, 0);
        const porcentagemConclusao = (atividadesConcluidas.length / totalAtividades) * 100;

        const progressoUpdated = await prisma.progressoCurso.update({
            where: {
                userId_cursoId: {
                    userId: req.user.id,
                    cursoId: cursoid,
                },
            },
            data: {
                atividadesConcluidas: atividadesConcluidas,
                atividadeAtual: atividadeAtual,
                porcentagem: porcentagemConclusao,
            },
        })

        if (!atividadeAtual) {
            let certificado
            await prisma.$transaction(async (newPrisma) => {

                certificado = await newPrisma.certificado.create({
                    data: {
                        userId: req.user.id,
                        cursoId: cursoid
                    }
                })

                await newPrisma.inscricao.update({
                    where: {
                        userId_cursoId: {
                            userId: req.user.id,
                            cursoId: cursoid
                        }
                    },
                    data: {
                        status: "Finalizado",
                        dataTermino: new Date()
                    }
                })
            })

            return sendResponse(res, 201, [{ ...progressoUpdated, certificado: certificado }])
        }

        return sendResponse(res, 201, progressoUpdated)
    }
}