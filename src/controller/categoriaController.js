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

    static async listarCategoriasPorID(req, res) {
        const { id } = req.params

        /*let findcategoria = await prisma.categoria.findUnique({
            where: {
                id: id
            }//*
        })**/

        return sendResponse(res, 200, req.body.categoria)
    }

    static async alterarCategoria(req, res) {
        const {id} = req.params

        let { nome } = req.body

        await prisma.categoria.update({
            where: {
                id: id,
            },
            data: {
                nome
            },
        })

        return sendResponse(res, 200, [])
    }

    static async deletarCategoria(req, res) {
        const { id } = req.params

        await prisma.categoria.delete({
            where: {
                id: id,
            },
        })

        return sendResponse(res, 200, [])
    }
}

