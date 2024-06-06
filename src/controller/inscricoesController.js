import { prisma } from "../config/prismaClient.js";
import messages, { sendResponse } from "../utils/mensagens.js";

export default class InscricoesController {
    static async criarInscricao(req, res) {
        let { cursoID, userID, status } = req.body

        const inscricaoCriada = await prisma.inscricao.create({
            data: {
                curso: {
                    connect: { id: cursoID } // conecta ao curso existente
                },
                usuario: {
                    connect: { id: userID } // conecta ao usuário existente
                },
                status
            },
        });

        return sendResponse(res, 201, inscricaoCriada);
    }

    static async listarInscricoes(req, res) {

        const inscricoes = await prisma.inscricao.findMany({
            include: {
                usuario: true,
                curso: true
            }
        });

        return sendResponse(res, 200, inscricoes);
    }

    static async listarCursosPorUsuario(req, res) {
        const cursos = await prisma.curso.findMany({

        })
    }

    static async listarCursoPorId(req, res) {
        const { id } = req.params;
        const curso = await prisma.curso.findUnique({
            where: {
                id: id
            },
            include: {
                categoria: true
            }
        });

        if (!curso) {
            const cursos = await prisma.curso.findMany({
                include: {
                    categoria: true
                }
            });
            return sendResponse(res, 404);
        }
        return sendResponse(res, 200, curso);
    }

    static async deletarCurso(req, res) {
        const { id } = req.params;
        if (!id) {
            return sendResponse(res, 400, messages.httpCodes[400]);
        }
        const curso = await prisma.curso.delete({
            where: {
                id: id
            }
        });

        if (!curso) {
            return sendResponse(res, 404, messages.httpCodes[404]);
        }
        return sendResponse(res, 204, messages.httpCodes[204]);
    }

}