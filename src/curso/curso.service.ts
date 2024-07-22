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

    async create(request: any,curso: CursoDTO) {
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

        if(createCurso !== null){
            await this.prisma.instrutores.create({
                data:{
                    cursoId: createCurso.id,
                    userId: request.user.id,
                    criadorDoCurso: true
                }
            })
        }

        return this.utils.respostaPadrao(201, [createCurso])
    }

    async findAll(){
        const findCursos: CursoDTO[] = await this.prisma.curso.findMany()

        return this.utils.respostaPadrao(200,findCursos)
    }

    async Remove(id:string){
        const erros: string[] = []
        
        if (!id) {
            erros.push(messages.error.invalidID)
        }else{
            const cursoExist: CursoDTO = await this.prisma.curso.findUnique({
                where: {
                    id
                }
            })

            if(cursoExist !== null){
                erros.push(messages.auth.userNotFound(id))
            }
        }

        if (erros.length > 0) this.utils.respostaErro(422, erros)
            
        await this.prisma.instrutores.deleteMany({
            where:{
                cursoId: id
            }
        })

        await this.prisma.usuario.delete({
            where: {
                id
            }
        })

        return this.utils.respostaPadrao(200, [])

    }
}
