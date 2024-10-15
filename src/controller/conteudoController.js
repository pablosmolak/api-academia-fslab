import { prisma } from "../config/prismaClient.js"
import { tiposConteudosEnum } from "../utils/enums.js"
import messages, { sendError, sendResponse } from "../utils/mensagens.js"

export default class ConteudoController {
    static async criarConteudo(req, res) {
        const erros = []

        const { topicoId, tipo, conteudo, cargaHoraria } = req.body

        if (!topicoId) {
            erros.push(messages.validationGeneric.fieldIsRequired("topicoId"))
        } else {
            const findTopico = await prisma.topico.findUnique({
                where: {
                    id: topicoId
                }
            })

            if (findTopico === null) {
                erros.push(messages.validationGeneric.notFound("topicoId"))
            }
        }

        if (!Object.values(tiposConteudosEnum).includes(tipo)) {
            erros.push(messages.validationGeneric.mustBeOneOf("tipo", tiposConteudosEnum))
        } else {
            const regexYT = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

            if (!regexYT.test(conteudo)) {
                erros.push("O conteúdo informado não é um link do youtube")
            }
        }

        if (!cargaHoraria) {
            erros.push(messages.validationGeneric.fieldIsRequired("cargaHoraria"))
        } else {
            const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

            if (!timeRegex.test(cargaHoraria)) {
                erros.push("Formato inválido de carga horária. Por favor, insira no formato: 'HH:MM:SS'");
            }
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

        let findConteudos
        if (!topicoid) {
            erros.push(messages.validationGeneric.notFound("topicoid"))
        } else {
            findConteudos = await prisma.conteudoCurso.findMany({
                where: {
                    topicoId: topicoid
                },
                orderBy: { ordem: 'asc' }
            })

            if (findConteudos.length === 0) {
                erros.push(messages.validationGeneric.notFound("ID"))
            }
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        return sendResponse(res, 200, findConteudos)
    }

    static async deletarConteudo(req, res) {
        const erros = []

        const { id } = req.params

        let findConteudo
        if (!id) {
            erros.push(messages.validationGeneric.notFound("id"))
        } else {
            findConteudo = await prisma.conteudoCurso.findUnique({
                where: {
                    id: id
                }
            })

            if (findConteudo === null) {
                erros.push(messages.validationGeneric.mascCamp("Conteúdo"))
            }

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