import { prisma } from "../config/prismaClient.js";
import messages, { sendError, sendResponse } from "../utils/mensagens.js";
import { categoriaSchema } from "../schema/categoriaSchema.js";

export default class CategoriaController {
    static async criarCategoria(req, res) {
        const erros = []

        let { nome } = categoriaSchema.criarCategoria.parse(req.body)

        const findCategoria = await prisma.categoria.findFirst({
            where: {
                nome: nome
            }
        })

        if (findCategoria !== null) {
            erros.push({ path: "nome", message: messages.validationGeneric.fieldIsRepeated("Nome") })
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        const categoriaCriada = await prisma.categoria.create({
            data: {
                nome: nome
            }
        })

        return sendResponse(res, 201, categoriaCriada);
    }

    static async listarCategorias(req, res) {
        const categorias = await prisma.categoria.findMany();

        return sendResponse(res, 200, categorias);
    }

    static async listarCategoriasPorID(req, res) {
        const { id } = categoriaSchema.alterarCategoria.parse(req.params)

        const categoriaExist = await prisma.categoria.findUnique({
            where: {
                id: id
            }
        })

        if (categoriaExist === null) {
            return sendError(res, 404, messages.validationGeneric.notFound("id"))
        }

        return sendResponse(res, 200, categoriaExist)
    }

    static async alterarCategoria(req, res) {
        const erros = []

        const { id } = req.params

        let { nome } = req.body

        categoriaSchema.alterarCategoria.parse({ id, nome })

        const categoriaExist = await prisma.categoria.findUnique({
            where: {
                id
            }
        })

        if (categoriaExist === null) {
            erros.push(messages.validationGeneric.notFound("id"))
        }

        if (nome) {
            const findCategoria = await prisma.categoria.findFirst({
                where: {
                    nome: nome
                }
            })

            if (findCategoria !== null && findCategoria.id !== id) {
                erros.push(messages.validationGeneric.fieldIsRepeated("Nome"))
            }
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        await prisma.categoria.update({
            where: {
                id: id
            },
            data: {
                nome: nome
            }
        })

        return sendResponse(res, 200, [])
    }

    static async deletarCategoria(req, res) {
        const erros = []
        const { id } = categoriaSchema.alterarCategoria.parse(req.params)


        const categoriaExist = await prisma.categoria.findUnique({
            where: {
                id
            }
        })

        if (categoriaExist === null) {
            erros.push(messages.validationGeneric.notFound("id"))
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        await prisma.categoria.delete({
            where: {
                id
            }
        })

        return sendResponse(res, 200, [])
    }
}