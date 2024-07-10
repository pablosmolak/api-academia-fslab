import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { FiltersUsuarioDTO, UsuariosDTO } from './usuarios.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class UsuariosService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly respostas: UtilsService
    ) { }

    async create(user: UsuariosDTO) {

        const erros: string[] = []

        if (!user.nome) {
            erros.push("teste teste")
        }else{
            if(user.nome.length < 3 || user.nome.length > 200){
                erros.push("teste 2")
            }
        }

        if(!user.email){
            erros.push("")
        }else{
            let userExist:{} = await this.prisma.usuario.findUnique({
                where:{email: user.email}
            })

            if(userExist !== null){
                erros.push('0')
            }

        }

        if(!user.senha){
            erros.push("")
        }else{

        }

        if (erros.length > 0) throw new HttpException(this.respostas.respostaPadrao(422, [], erros), HttpStatus.UNPROCESSABLE_ENTITY)

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

    async update(id: string, users: UsuariosDTO) {

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