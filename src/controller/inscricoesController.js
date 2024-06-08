import { prisma } from "../config/prismaClient.js";
import messages, { sendResponse } from "../utils/mensagens.js";

export default class InscricoesController {
    static async criarInscricao(req, res) {
        const { cursoID, userID } = req.body

        const inscricaoCriada = await prisma.inscricao.create({
            data: {
                curso: {
                    connect: { id: cursoID } // conecta ao curso existente
                },
                usuario: {
                    connect: { id: userID } // conecta ao usuário existente
                },
                status: "Em Andamento"
            },
        });

        return sendResponse(res, 201, inscricaoCriada);
    }

    static async listarInscricoes(req, res) {

        const inscricoes = await prisma.inscricao.findMany({
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

    static async listarInscricaoPorId(req, res) {
        const { id } = req.params

        const inscricao = await prisma.inscricao.findUnique({
            where: {
                id: id
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

        return sendResponse(res, 200, inscricao);
    }

    static async deletarInscricao(req, res) {
        const { id } = req.params;

        await prisma.inscricao.delete({
            where: {
                id: id
            }
        });

        return sendResponse(res, 200, messages.httpCodes[200]);
    }


    static async concluirInscrição(req, res) {
        const { id } = req.params

        const inscricao = await prisma.inscricao.update({
            where: {
                id
            },
            data: {
                status: "Concluído"
            }
        })

        const certificado = await prisma.certificado.create({
            data: {
                userId: inscricao.userId,
                cursoId: inscricao.cursoId,
            }
        })

        return sendResponse(res, 200, certificado);
    }

}