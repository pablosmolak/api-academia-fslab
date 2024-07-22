import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { FiltersInscricaoDTO, InscricaoDTO } from './inscricao.dto';
import { messages } from 'src/utils/mensagens';
import { CursoDTO } from 'src/curso/curso.dto';
import { UsuariosDTO } from 'src/usuarios/usuarios.dto';


@Injectable()
export class InscricaoService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly utils: UtilsService
    ) { }

    async create(request: any, inscricao: InscricaoDTO) {
        const erros: string[] = []

        if (!inscricao.cursoId) {
            erros.push(messages.validationGeneric.fieldIsRequired("CursoID"))
        } else {
            const findCurso: CursoDTO = await this.prisma.curso.findUnique({
                where: { id: inscricao.cursoId }
            })

            if (findCurso === null) {
                erros.push(messages.validationGeneric.invalid("CursoID"))
            } else {
                const findInscricaoCurso = await this.prisma.inscricao.findFirst({
                    where: {
                        userId: request.user.id,
                        cursoId: inscricao.cursoId,
                    }
                })

                if (findInscricaoCurso !== null) {
                    erros.push("Já existe uma inscrição neste curso para o usuário")
                }
            }
        }

        if (erros.length > 0) this.utils.respostaErro(422, erros)

        const inscricaoCriada: InscricaoDTO = await this.prisma.inscricao.create({
            data: {
                curso: {
                    connect: { id: inscricao.cursoId } // conecta ao curso existente
                },
                usuario: {
                    connect: { id: request.user.id } // conecta ao usuário existente
                },
                status: "Em Andamento"
            }
        })

        return this.utils.respostaPadrao(201, [inscricaoCriada])
    }

    async findAll(filter: FiltersInscricaoDTO) {
        let filtros: any = { where: {} }

        if (filter.cursoId) filtros.where.cursoId = { contains: filter.cursoId }
        if (filter.usuarioId) filtros.where.userId = { contains: filter.usuarioId }

        console.log(filtros)

        const findInscricoes: InscricaoDTO[] = await this.prisma.inscricao.findMany({
            ...filtros,
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                curso: {
                    select: {
                        id: true,
                        nome: true,
                        descricao: true
                    }
                }
            }
        })

        return this.utils.respostaPadrao(422, findInscricoes)
    }

    async remove(userID: string, cursoID: string) {
        const erros: string[] = []

        if (!userID) {
            erros.push(messages.validationGeneric.fieldIsRequired("usuarioid"))
        } else {
            const userExist: UsuariosDTO = await this.prisma.usuario.findUnique({
                where: {
                    id: userID
                }
            })

            if (userExist === null) {
                erros.push(messages.validationGeneric.notFound("id de usuário"))
            }
        }

        if (!cursoID) {
            erros.push(messages.validationGeneric.fieldIsRequired("cursoid"))
        } else {
            const cursoExist: CursoDTO = await this.prisma.curso.findUnique({
                where: {
                    id: cursoID
                }
            })

            if (cursoExist === null) {
                erros.push(messages.validationGeneric.notFound("id de curso"))
            }
        }

        if (erros.length > 0) this.utils.respostaErro(422, erros)

        const inscricaoExist: InscricaoDTO = await this.prisma.inscricao.findUnique({
            where: {
                userId_cursoId: {
                    userId: userID,
                    cursoId: cursoID,
                },
            },
        })

        if(inscricaoExist === null){
            return this.utils.respostaErro(422, [messages.validationGeneric.femCamp("Inscrição")])
        }

        await this.prisma.inscricao.delete({
            where: {
                userId_cursoId: {
                    userId: userID,
                    cursoId: cursoID,
                },
            },
        })

        return this.utils.respostaPadrao(200, [])
    }
}
