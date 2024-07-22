import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { FiltersUsuarioDTO, UsuariosDTO } from './usuarios.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { messages } from 'src/utils/mensagens';
import * as bcrypt from 'bcrypt';
import { error } from 'console';

@Injectable()
export class UsuariosService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly utils: UtilsService
    ) { }

    async create(user: UsuariosDTO) {

        const erros: string[] = []

        if (!user.nome) {
            erros.push(messages.validationGeneric.fieldIsRequired("Nome"))
        } else {
            if (user.nome.length < 3) {
                erros.push(messages.customValidation.lengthMaior("Nome", 3))
            } else if (user.nome.length > 200) {
                erros.push(messages.customValidation.lengthMenor("Nome", 200))
            }
        }

        if (!user.email) {
            erros.push(messages.validationGeneric.fieldIsRequired("E-mail"))
        } else if (this.utils.validarEmail(user.email, erros)) {
            let userExist: UsuariosDTO = await this.prisma.usuario.findUnique({
                where: { email: user.email }
            })

            if (userExist !== null) {
                erros.push(messages.auth.emailAlreadyExists(user.email))
            }
        }

        if (!user.senha) {
            erros.push(messages.validationGeneric.fieldIsRequired("Senha"))
        } else {
            this.utils.validarSenha(user.senha, erros)
        }

        if (erros.length > 0) this.utils.respostaErro(422, erros)

        user.senha = bcrypt.hashSync(user.senha, 10)

        const newUser: UsuariosDTO = await this.prisma.usuario.create({
            data: {
                ...user
            }
        })

        return this.utils.respostaPadrao(201, [newUser])
    }

    async findAll(filter: FiltersUsuarioDTO) {
        let filtros: any = { where: {} }

        if (filter.nome) filtros.where.nome = { contains: filter.nome }
        if (filter.email) filtros.where.email = { contains: filter.email }

        let userExiste: UsuariosDTO[] = await this.prisma.usuario.findMany(filtros)

        for (let user of userExiste) {
            delete user.senha
        }

        return this.utils.respostaPadrao(200, [userExiste])
    }

    async findByID(id: string) {
        const erros: string[] = []

        let userExist: UsuariosDTO

        if (!id) {
            erros.push(messages.error.invalidID)
        }else{
            userExist = await this.prisma.usuario.findUnique({
                where: {
                    id:id
                }
            })

            if(userExist === null){
                erros.push(messages.auth.userNotFound(id))
            }
        }

        if (erros.length > 0) this.utils.respostaErro(422, erros)

        delete userExist.senha

        return this.utils.respostaPadrao(200, [userExist])
    }

    async update(id: string, user: UsuariosDTO) {
        const erros: string[] = []

        if (user.nome) {
            if (user.nome.length < 3) {
                erros.push(messages.customValidation.lengthMaior("Nome", 3))
            } else if (user.nome.length > 200) {
                erros.push(messages.customValidation.lengthMenor("Nome", 200))
            }
        }

        if (user.email && this.utils.validarEmail(user.email, erros)) {
            let userExist: UsuariosDTO = await this.prisma.usuario.findUnique({
                where: { email: user.email }
            })

            if (userExist !== null) {
                erros.push(messages.auth.emailAlreadyExists(user.email))
            }
        }

        if (user.senha) {
            this.utils.validarSenha(user.senha, erros)
        }

        if (erros.length > 0) this.utils.respostaErro(422, erros)

        await this.prisma.usuario.update({
            where: { id: id },
            data: {
                ...user
            }
        })

        return this.utils.respostaPadrao(201, [])
    }

    async remove(id: string) {
        const erros: string[] = []

        let userExist: UsuariosDTO
        
        if (!id) {
            erros.push(messages.error.invalidID)
        }else{
            userExist = await this.prisma.usuario.findUnique({
                where: {
                    id
                }
            })

            if(userExist !== null){
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