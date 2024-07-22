import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';
import { CategoriaModule } from './categoria/categoria.module';
import { CertificadoModule } from './certificado/certificado.module';
import { CursoModule } from './curso/curso.module';
import { InscricaoModule } from './inscricao/inscricao.module';
import { RecuperaSenhaModule } from './recupera-senha/recupera-senha.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsuariosModule, PrismaModule, AuthModule, UtilsModule, CategoriaModule, CertificadoModule, CursoModule, InscricaoModule, RecuperaSenhaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
