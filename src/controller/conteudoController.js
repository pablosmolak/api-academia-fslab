import { prisma } from "../config/prismaClient.js"
import { tiposConteudosEnum } from "../utils/enums.js"
import messages, { sendError, sendResponse } from "../utils/mensagens.js"
import { conteudoCursoSchema } from "../schema/conteudoCursoSchema.js"

export default class ConteudoController {
    static async criarConteudo(req, res) {
        const erros = []

        const { topicoId, titulo, tipo, conteudo, cargaHoraria } = conteudoCursoSchema.criarConteudo.parse(req.body)

        const findTopico = await prisma.topico.findUnique({
            where: {
                id: topicoId
            }
        })

        if (findTopico === null) {
            erros.push(messages.validationGeneric.notFound("topicoId"))
        }

        const conteudoExistente = await prisma.conteudoCurso.findFirst({
            where: {
                titulo,
                topicoId,
            },
        });

        if (conteudoExistente) {
            erros.push('Já existe um conteúdo com este título neste tópico.')
        }

        //quando for add novos tipos de conteudo revalidar esse campo
        const regexYT = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

        if (!regexYT.test(conteudo)) {
            erros.push("O conteúdo informado não é um link do youtube")
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        const quantidadeConteudo = await prisma.conteudoCurso.count({
            where: {
                topicoId: topicoId
            }
        })

        const createConteudo = await prisma.conteudoCurso.create({
            data: {
                topicoId: topicoId,
                tipo: tipo,
                cargaHoraria,
                conteudo: conteudo,
                ordem: (quantidadeConteudo + 1)
            }
        })

        return sendResponse(res, 201, createConteudo)
    }

    static async buscarConteudoPorTopico(req, res) {
        const erros = []

        const { topicoid } = req.params

        const findConteudos = await prisma.conteudoCurso.findMany({
            where: {
                topicoId: topicoid
            },
            orderBy: { ordem: 'asc' }
        })

        if (findConteudos.length === 0) {
            erros.push(messages.validationGeneric.notFound("ID"))
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        return sendResponse(res, 200, findConteudos)
    }

    static async deletarConteudo(req, res) {
        const erros = []

        const { id } = req.params

        const findConteudo = await prisma.conteudoCurso.findUnique({
            where: {
                id: id
            }
        })

        if (findConteudo === null) {
            erros.push(messages.validationGeneric.mascCamp("Conteúdo"))
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        await prisma.$transaction(async (prisma) => {
            await prisma.conteudoCurso.delete({
                where: {
                    id: id
                }
            })

            await prisma.conteudoCurso.updateMany({
                where: {
                    topicoId: findConteudo.topicoId,
                    ordem: {
                        gt: findConteudo.ordem
                    }
                },
                data: {
                    ordem: {
                        decrement: 1
                    }
                }
            })
        })

        return sendResponse(res, 200, [])
    }
}