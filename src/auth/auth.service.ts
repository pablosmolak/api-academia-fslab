import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcript from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) { }

    async singIn(auth: AuthDto) {

        const findUser = await this.prisma.usuario.findUnique({
            where: { email: auth.email },
            include: {
                Grupo: {
                    select: {
                        nome: true
                    }
                }
            }
        })

        if (findUser === null) throw new UnauthorizedException()

        if (!(await bcript.compare(auth.senha, findUser.senha))) throw new UnauthorizedException()

        if (!findUser.ativo) throw new UnauthorizedException()

        const token = {
            token: this.jwtService.sign(
                {
                    id: findUser.id,
                    nome: findUser.nome,
                    email: findUser.email,
                    ativo: findUser.ativo,
                    grupo: findUser.Grupo.nome
                }
            )
        }

        return token
    }
}