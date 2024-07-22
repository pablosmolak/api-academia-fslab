import { Injectable } from '@nestjs/common';
import { CursoDTO } from './curso.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { messages } from 'src/utils/mensagens';

@Injectable()
export class CursoService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly utils: UtilsService
    ) { }

    async create(curso: CursoDTO) {
        const erros: string[] = []

        if (!curso.nome) {
            erros.push(messages.validationGeneric.fieldIsRequired("Nome"))
        } else {
            if (curso.nome.length < 3) {
                erros.push(messages.customValidation.lengthMaior("Nome", 3))
            } else if (curso.nome.length > 200) {
                erros.push(messages.customValidation.lengthMenor("Nome", 200))
            }
        }

        if (curso.descricao) {
            if (curso.descricao.length < 3) {
                erros.push(messages.customValidation.lengthMaior("Nome", 3))
            } else if (curso.descricao.length > 200) {
                erros.push(messages.customValidation.lengthMenor("Nome", 200))
            }
        }

        if (!curso.categoria) {
            erros.push(messages.validationGeneric.fieldIsRequired("Categoria"))
        }

        if (erros.length > 0) this.utils.respostaErro(422, erros)

        const createCurso = await this.prisma.curso.create({
            data: {
                nome: curso.nome,
                descricao: curso?.descricao,
                categoria: {
                    connect: curso.categoria.map((id) => {
                        return { id }
                    }
                    )
                }
            }
        })

        return this.utils.respostaPadrao(201, [createCurso])
    }

    async findAll(){
        const findCursos: CursoDTO[] = await this.prisma.curso.findMany()

        return this.utils.respostaPadrao(200,findCursos)
    }
}
