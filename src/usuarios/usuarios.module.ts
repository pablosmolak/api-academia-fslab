import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  providers: [UsuariosService,PrismaService,UtilsService],
  controllers: [UsuariosController]
})
export class UsuariosModule {}
