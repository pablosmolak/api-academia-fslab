import { prisma } from "../config/prismaClient.js";
import { sendResponse } from "../utils/mensagens.js";

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



        return sendResponse(res, 200, cursos);
    }

}