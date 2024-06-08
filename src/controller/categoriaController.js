import { prisma } from "../config/prismaClient.js";
import { sendResponse } from "../utils/mensagens.js";

export default class CategoriaController {
    static async criarCategoria(req, res) {
        let { nome } = req.body

        const categoriaCriada = await prisma.categoria.create({
            data: {
                nome
            }
        });


        return sendResponse(res, 201, categoriaCriada);
    }

    static async listarCategorias(req, res) {
        const categorias = await prisma.categoria.findMany();

        return sendResponse(res, 200, categorias);
    }

}