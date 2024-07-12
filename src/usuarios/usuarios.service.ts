import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { FiltersUsuarioDTO, UsuariosDTO } from './usuarios.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { messages } from 'src/utils/mensagens';

@Injectable()
export class UsuariosService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly respostas: UtilsService
    ) { }

    async create(user: UsuariosDTO) {

        const erros: string[] = []

        if (!user.nome) {
            erros.push(messages.validationGeneric.fieldIsRequired("Nome"))
        }else{
            if(user.nome.length < 3){
                erros.push(messages.customValidation.lengthMaior("Nome", 3))
            }else if(user.nome.length > 200){
                erros.push(messages.customValidation.lengthMenor("Nome", 200))
            }
        }

        if(!user.email){
            erros.push(messages.validationGeneric.fieldIsRequired("E-mail"))
        }else{
            let userExist:{} = await this.prisma.usuario.findUnique({
                where:{email: user.email}
            })

            if(userExist !== null){
                erros.push(messages.auth.emailAlreadyExists(user.email))
            }

        }

        if(!user.senha){
            erros.push(messages.validationGeneric.fieldIsRequired("Senha"))
        }else{

        }

        if (erros.length > 0) this.respostas.respostaErro(422, [], erros)

        const newUser: UsuariosDTO = await this.prisma.usuario.create({
            data: {
                ...user
            }
        })

        return this.respostas.respostaPadrao(201, [newUser], [])
    }

    async findAll(filter: FiltersUsuarioDTO) {

        let filtros: any = { where: {} }

        if (filter.nome) filtros.where.nome = { contains: filter.nome }
        if (filter.email) filtros.where.email = { contains: filter.email }

        let userExiste: UsuariosDTO[] = await this.prisma.usuario.findMany(filtros)

        for (let user of userExiste) {
            delete user.senha
        }

        return this.respostas.respostaPadrao(200, [userExiste], [])
    }

    async findByID(id: string) {
        let findUser: UsuariosDTO = await this.prisma.usuario.findUnique({
            where: {
                id
            }
        })

        delete findUser.senha

        return this.respostas.respostaPadrao(200, [findUser], [])
    }

    async update(id: string, user: UsuariosDTO) {
        const erros: string[] = []

        if (!user.nome) {
            erros.push(messages.validationGeneric.fieldIsRequired("Nome"))
        }else{
            if(user.nome.length < 3){
                erros.push(messages.customValidation.lengthMaior("Nome", 3))
            }else if(user.nome.length > 200){
                erros.push(messages.customValidation.lengthMenor("Nome", 200))
            }
        }

        if(!user.email){
            erros.push(messages.validationGeneric.fieldIsRequired("E-mail"))
        }else{
            let userExist:{} = await this.prisma.usuario.findUnique({
                where:{email: user.email}
            })

            if(userExist !== null){
                erros.push(messages.auth.emailAlreadyExists(user.email))
            }

        }

        if(!user.senha){
            erros.push(messages.validationGeneric.fieldIsRequired("Senha"))
        }else{

        }

        if (erros.length > 0) this.respostas.respostaErro(422, [], erros)

        const newUser: UsuariosDTO = await this.prisma.usuario.update({
            where:{id:id},
            data: {
                ...user
            }
        })
    }

    async remove(id: string) {

        const userExiste: UsuariosDTO = await this.prisma.usuario.findUnique({
            where: {
                id
            }
        })

        if (!userExiste) {
            throw new NotFoundException()
        }

        await this.prisma.usuario.delete({
            where: {
                id
            }
        })

        return this.respostas.respostaPadrao(200, [], [])
    }
}