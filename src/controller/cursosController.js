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

    static async listarCursosPorUsuario(req, res) {
        let { usuarioID } = req.params

        const cursosInscritos = await prisma.usuario.findUnique({
            where: { id: usuarioID },
            select: {
                inscricoes: {
                    select: {
                        curso: {
                            select: {
                                id: true,
                                nome: true,
                                descricao:true,
                                
                            },
                        },
                        status: true,
                        dataInscricao: true,
                    },
                },
            },
        });

        return sendResponse(res, 200, cursosInscritos);

    }

}