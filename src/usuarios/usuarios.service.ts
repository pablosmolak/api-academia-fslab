import { Injectable } from '@nestjs/common';
import { UsuariosDTO } from './usuarios.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class UsuariosService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly respostas: UtilsService
    ) {}

    async create(user: UsuariosDTO){

        const newUser: UsuariosDTO = await this.prisma.usuario.create({
            data:{
                ...user
            }
        })

        return this.respostas.respostaPadrao(200,[newUser])
    }
}
