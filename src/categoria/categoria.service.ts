import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { categoriaDTO } from './categoria.dto';
import { messages } from 'src/utils/mensagens';

@Injectable()
export class CategoriaService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly utils: UtilsService
    ) { }

    async create(categoria: categoriaDTO) {
        const erros: string[] = []

        if (!categoria.nome) {
            erros.push(messages.validationGeneric.fieldIsRequired("Nome"))
        } else {
            const findCategoria: categoriaDTO = await this.prisma.categoria.findFirst({
                where: {
                    nome: categoria.nome
                }
            })

            if (findCategoria !== null) {
                erros.push(messages.validationGeneric.fieldIsRepeated("Nome"))
            } else {
                if (categoria.nome.length < 3) {
                    erros.push(messages.customValidation.lengthMaior("Nome", 3))
                } else if (categoria.nome.length > 200) {
                    erros.push(messages.customValidation.lengthMenor("Nome", 200))
                }
            }
        }

        if (erros.length > 0) this.utils.respostaErro(422, erros)

        const categoriaCreate: categoriaDTO = await this.prisma.categoria.create({
            data: {
                ...categoria
            }
        })

        return this.utils.respostaPadrao(201, [categoriaCreate])
    }

    async findAll() {
        const findCategoria: categoriaDTO[] = await this.prisma.categoria.findMany()

        return this.utils.respostaPadrao(200, [...findCategoria])
    }

    async findByID(id: string) {
        const erros: string[] = []

        let categoriaExist: categoriaDTO

        if (!id) {
            erros.push(messages.error.invalidID)
        }else{
            categoriaExist = await this.prisma.categoria.findUnique({
                where: {
                    id:id
                }
            })

            if(categoriaExist === null){
                erros.push(messages.auth.userNotFound(id))
            }
        }

        if (erros.length > 0) this.utils.respostaErro(422, erros)

        return this.utils.respostaPadrao(200, [categoriaExist])
    }

    async update(id: string) {

    }

    async remove(id: string) {
        const erros: string[] = []

        let categoriaExist: categoriaDTO
        
        if (!id) {
            erros.push(messages.error.invalidID)
        }else{
            categoriaExist = await this.prisma.usuario.findUnique({
                where: {
                    id
                }
            })

            if(categoriaExist !== null){
                erros.push(messages.auth.userNotFound(id))
            }
        }

        if (erros.length > 0) this.utils.respostaErro(422, erros) 

        await this.prisma.usuario.delete({
            where: {
                id
            }
        })

        return this.utils.respostaPadrao(200, [])
    }
}
