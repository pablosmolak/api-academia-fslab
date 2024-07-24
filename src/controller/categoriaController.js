import { prisma } from "../config/prismaClient.js";
import messages, { sendError, sendResponse } from "../utils/mensagens.js";

export default class CategoriaController {
    static async criarCategoria(req, res) {
        const erros = []

        let { nome } = req.body

        if (nome) {
            erros.push(messages.validationGeneric.fieldIsRequired("Nome"))
        } else {
            const findCategoria = await prisma.categoria.findFirst({
                where: {
                    nome: categoria.nome
                }
            })

            if (findCategoria !== null) {
                erros.push(messages.validationGeneric.fieldIsRepeated("Nome"))
            } else {
                if (nome.length < 3) {
                    erros.push(messages.customValidation.lengthMaior("Nome", 3))
                } else if (nome.length > 200) {
                    erros.push(messages.customValidation.lengthMenor("Nome", 200))
                }
            }
        }

        if (erros.length > 0) sendError(res, 422, erros)

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
        const { id } = req.params

        let categoriaExist

        if (!id) {
            erros.push(messages.error.invalidID)
        } else {
            categoriaExist = await prisma.categoria.findUnique({
                where: {
                    id: id
                }
            })

            if (categoriaExist === null) {
                erros.push(messages.validationGeneric.notFound("id"))
            }
        }

        if (erros.length > 0) this.utils.respostaErro(404, erros)


        return sendResponse(res, 200, categoriaExist)
    }

    static async alterarCategoria(req, res) {
        const erros = []

        const { id } = req.params
        let { nome } = req.body

        let categoriaExist

        if (!id) {
            erros.push(messages.error.invalidID)
        } else {
            categoriaExist = await prisma.usuario.findUnique({
                where: {
                    id
                }
            })

            if (categoriaExist !== null) {
                erros.push(messages.validationGeneric.notFound("id"))
            }
        }

        if (nome) {
            const findCategoria = await this.prisma.categoria.findFirst({
                where: {
                    nome: categoria.nome
                }
            })

            if (findCategoria !== null && findCategoria.id !== id) {
                erros.push(messages.validationGeneric.fieldIsRepeated("Nome"))
            } else {
                if (nome.length < 3) {
                    erros.push(messages.customValidation.lengthMaior("Nome", 3))
                } else if (nome.length > 200) {
                    erros.push(messages.customValidation.lengthMenor("Nome", 200))
                }
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
        const { id } = req.params

        if (!id) {
            erros.push(messages.error.invalidID)
        } else {
            const categoriaExist = await prisma.categoria.findUnique({
                where: {
                    id
                }
            })

            if (categoriaExist === null) {
                erros.push(messages.validationGeneric.notFound("id"))
            }
        }

        if (erros.length > 0) return sendError(res,422,erros)

        await prisma.categoria.delete({
            where: {
                id
            }
        })

        return sendResponse(res,200,[])
    }
}