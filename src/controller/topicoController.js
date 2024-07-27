import { prisma } from "../config/prismaClient.js"
import messages, { sendError, sendResponse } from "../utils/mensagens.js"

export default class TopicoController {

    static async criarTopico(req,res){
        const erros = []    

        const {titulo, cursoId} = req.body

        if (!titulo) {
            erros.push(messages.validationGeneric.fieldIsRequired("titulo"))
        } else {
            if (titulo.length < 3) {
                erros.push(messages.customValidation.lengthMaior("Titulo", 3))
            } else if (titulo.length > 200) {
                erros.push(messages.customValidation.lengthMenor("Titulo", 200))
            }
        }

        if (!cursoId) {
            erros.push(messages.validationGeneric.fieldIsRequired("cursoId"))
        } else {
            const findCursos = await prisma.curso.findUnique({
                where: {
                    id: cursoId
                }
            })

            if (findCursos === null) {
                erros.push(messages.validationGeneric.notFound("CursoId"))
            }
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        const quantidadeTopicos = await prisma.topico.count({
            where: {
                cursoId: cursoId
            }
        })

        const topicoCreate = await prisma.topico.create({
            data: {
                titulo: titulo,
                ordem: (quantidadeTopicos + 1),
                cursoId: cursoId
            }
        })

        return sendResponse(res,201,topicoCreate)
    }

    static async listarTopicoPorID(req,res){
        const {id} = req.params
        
        const findAula = await prisma.aula.findUnique({
            where: {
                id: id
            }
        })

        if (findAula === null) {
            return sendError(res,404,[messages.validationGeneric.notFound("ID")])
        }

        return sendResponse(res,200,findAula)
    }

    static async listarTopicoPorCurso(req,res) {
        const {cursoid} = req.params

        const findAulas = await prisma.aula.findMany({
            where: {
                cursoId: cursoid
            },
            orderBy: { ordem: 'asc' }
        })

        if (findAulas.length === 0) {
            return sendError(res,404,[messages.validationGeneric.notFound("ID")])
        }

        return sendResponse(res,200,findAulas) 
    }

    static async deletarTopico(req,res){
        const erros = []

        const {id} = req.params

        const findAula = await prisma.aula.findUnique({
            where: {
                id: id
            }
        })

        if (!findAula) {
            erros.push(messages.validationGeneric.femCamp("Aula"))
        }

        if (erros.length > 0) return sendError(res,422,erros)

        await prisma.$transaction(async (prisma) => {
            await prisma.aula.delete({
                where: {
                    id: id
                }
            })

            await prisma.aula.updateMany({
                where: {
                    cursoId: findAula.cursoId,
                    ordem: {
                        gt: findAula.ordem
                    }
                },
                data: {
                    ordem: {
                        decrement: 1
                    }
                }
            })
        })

        return sendResponse(res,200,[])
    }

    static async alterarTopico(req,res){
        const erros = []

        const {id} = req.params
        const {titulo, cursoId, ordem} = req.body

        const findAula = await prisma.aula.findUnique({
            where: {
                id: id
            }
        })

        if (findAula === null) {
            erros.push(messages.validationGeneric.notFound("id"))
        }

        if (titulo) {
            if (titulo.length < 3) {
                erros.push(messages.customValidation.lengthMaior("Titulo", 3))
            } else if (titulo.length > 200) {
                erros.push(messages.customValidation.lengthMenor("Titulo", 200))
            }
        }

        if (ordem) {
            if (!Number.isInteger(aula.ordem)) {
                erros.push("O campo ordem precisa ser um número inteiro")
            }
        }

        if (erros.length > 0) return sendError(res,422,erros)

        const totalAulas = await this.prisma.aula.count({
            where: {
                cursoId: cursoId
            }
        })

        const ordemAtual = findAula.ordem;
        let novaOrdem

        if (aula.ordem) {
            novaOrdem = Math.max(1, Math.min(aula.ordem, totalAulas))
        } else {
            novaOrdem = ordemAtual
        }

        await prisma.$transaction(async (prisma) => {
            if (ordemAtual !== novaOrdem) {
                if (novaOrdem > ordemAtual) {
                    await prisma.aula.updateMany({
                        where: {
                            cursoId: cursoId,
                            ordem: {
                                gt: ordemAtual,
                                lte: novaOrdem
                            }
                        },
                        data: {
                            ordem: {
                                decrement: 1
                            }
                        }
                    })
                } else if (novaOrdem < ordemAtual) {
                    await prisma.aula.updateMany({
                        where: {
                            cursoId: cursoId,
                            ordem: {
                                gte: novaOrdem,
                                lt: ordemAtual
                            }
                        },
                        data: {
                            ordem: {
                                increment: 1
                            }
                        }
                    })
                }
            }

            await prisma.aula.update({
                where: {
                    id: id
                },
                data: {
                    titulo: titulo,
                    ordem: novaOrdem
                }
            })
        })

        return sendResponse(res,200,[])
    }
}