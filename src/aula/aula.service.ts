import { Injectable } from '@nestjs/common';
import { AulaDTO } from './aula.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { messages } from 'src/utils/mensagens';
import { CursoDTO } from 'src/curso/curso.dto';

@Injectable()
export class AulaService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly utils: UtilsService
    ) { }

    async create(aula: AulaDTO) {
        const erros: string[] = []

        if (!aula.titulo) {
            erros.push(messages.validationGeneric.fieldIsRequired("titulo"))
        } else {
            if (aula.titulo.length < 3) {
                erros.push(messages.customValidation.lengthMaior("Titulo", 3))
            } else if (aula.titulo.length > 200) {
                erros.push(messages.customValidation.lengthMenor("Titulo", 200))
            }
        }

        if (!aula.cursoId) {
            erros.push(messages.validationGeneric.fieldIsRequired("cursoId"))
        } else {
            const findCursos: CursoDTO = await this.prisma.curso.findUnique({
                where: {
                    id: aula.cursoId
                }
            })

            if (findCursos === null) {
                erros.push(messages.validationGeneric.notFound("CursoID"))
            }
        }


        if (erros.length > 0) this.utils.respostaErro(422, erros)


        const quantidadeAulas: number = await this.prisma.aula.count({
            where: {
                cursoId: "646f2a07-178e-4d1c-b4f7-7f124d807ac4"
            }
        })

        const aulaCreate = await this.prisma.aula.create({
            data: {
                titulo: aula.titulo,
                ordem: (quantidadeAulas + 1),
                cursoId: aula.cursoId
            }
        })

        return this.utils.respostaPadrao(201, [aulaCreate])
    }

    async findById(aulaId: string) {
        const findAula: AulaDTO = await this.prisma.aula.findUnique({
            where: {
                id: aulaId
            }
        })

        if (findAula === null) {
            this.utils.respostaErro(404, [messages.validationGeneric.notFound("ID")])
        }

        return this.utils.respostaPadrao(200, [findAula])
    }

    async findByCurso(cursoId: string) {
        const erros: string[] = []

        const findAulas = await this.prisma.aula.findMany({
            where: {
                cursoId: cursoId
            },
            orderBy: { ordem: 'asc' }
        })

        if (findAulas === null) {
            erros.push(messages.validationGeneric.notFound("ID"))
        }

        if (erros.length > 0) this.utils.respostaErro(422, erros)

        return this.utils.respostaPadrao(200, [findAulas])
    }

    async remove(aulaid: string) {
        const erros: string[] = []

        const findAula: AulaDTO = await this.prisma.aula.findUnique({
            where: {
                id: aulaid
            }
        })

        if (!findAula) {
            erros.push(messages.validationGeneric.femCamp("Aula"))
        }

        if (erros.length > 0) this.utils.respostaErro(422, erros)

        await this.prisma.$transaction(async (prisma) => {
            await prisma.aula.delete({
                where: {
                    id: aulaid
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

        return this.utils.respostaPadrao(200, [])

    }

    async update(aulaID: string, aula: AulaDTO) {
        const erros: string[] = []

        const findAula = await this.prisma.aula.findUnique({
            where: {
                id: aulaID
            }
        })

        if (findAula === null) {
            erros.push(messages.validationGeneric.notFound("aulaID"))
        }

        if (aula.titulo) {
            if (aula.titulo.length < 3) {
                erros.push(messages.customValidation.lengthMaior("Titulo", 3))
            } else if (aula.titulo.length > 200) {
                erros.push(messages.customValidation.lengthMenor("Titulo", 200))
            }
        }

        if (aula.ordem) {
            if (!Number.isInteger(aula.ordem)) {
                erros.push("O campo ordem precisa ser um número inteiro")
            }
        }

        if (erros.length > 0) this.utils.respostaErro(422, erros)

        const totalAulas = await this.prisma.aula.count({
            where: {
                cursoId: findAula.cursoId
            }
        })

        const ordemAtual: number = findAula.ordem;
        let novaOrdem: number

        if (aula.ordem) {
            novaOrdem = Math.max(1, Math.min(aula.ordem, totalAulas))
        }else{
            novaOrdem = ordemAtual
        }

        await this.prisma.$transaction(async (prisma) => {
            if (ordemAtual !== novaOrdem) {
                if (novaOrdem > ordemAtual) {
                    await prisma.aula.updateMany({
                        where: {
                            cursoId: aula.cursoId,
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
                            cursoId: aula.cursoId,
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
                    id: aulaID
                },
                data: {
                    titulo: aula.titulo,
                    ordem: novaOrdem
                }
            })
        })

        return this.utils.respostaPadrao(200, [])
    }
}