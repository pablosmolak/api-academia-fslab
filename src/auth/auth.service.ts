import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcript from 'bcrypt';
import { UtilsService } from 'src/utils/utils.service';
import { messages } from 'src/utils/mensagens';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly utils: UtilsService
    ) { }

    async singIn(auth: AuthDto) {
        const erros: string[] = []

        if(!auth.email){
            erros.push(messages.validationGeneric.fieldIsRequired("E-mail"))
        }else{
            this.utils.validarEmail(auth.email, erros)
        }

        if(!auth.senha){
            erros.push(messages.validationGeneric.fieldIsRequired("Senha"))
        }

        if(erros.length > 0) this.utils.respostaErro(422,erros)

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

        if (findUser === null) this.utils.respostaErro(401, ["Usuário ou senha incorretos!"])

        if (!(await bcript.compare(auth.senha, findUser.senha))) this.utils.respostaErro(401, ["Usuário ou senha incorretos!"])

        if (!findUser.ativo) this.utils.respostaErro(401, ["Usuário ou senha incorretos!"])
            
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