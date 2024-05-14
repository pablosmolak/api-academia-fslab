import { prisma } from "../config/prismaClient.js";
import messages, { sendResponse } from "../utils/mensagens.js";

export default class CursosController {
    static async criarCurso(req, res) {
        let { nome, descricao, categoria } = req.body

        const cursoCriado = await prisma.curso.create({
            data: {
                nome,
                descricao,
                categoria: {
                    connect: categoria.map((id) => {
                        return { id }
                    }
                    )
                }
            },
        });
        return sendResponse(res, 201, cursoCriado);
    }

    static async listarCursos(req, res) {

        const cursos = await prisma.curso.findMany({
            include: {
                categoria: true
            }
        });
        console.log(cursos)

        if (!cursos==[]) { // verificar o porque que quando estiver diferente  ele entra no erro sendo que ele é um array vazio ??
            return sendResponse(res, 404, messages.httpCodes[404]);
        }

        return sendResponse(res, 200, cursos);
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
            return sendResponse(res, 404, cursos);// caso não encontre o curso, retorna todos os cursos ? 
        }
        return sendResponse(res, 200, curso);
    }

    static async deletarCurso(req, res) {
        const { id } = req.params;
        if (!id) {
            return sendResponse(res, 400, messages.httpCodes[400]);
        }
        const curso = await prisma.curso.delete({// verificar Bug de delatar curso que não existe pis cai no catch e retorna 500...
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