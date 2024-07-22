import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  providers: [CategoriaService, PrismaService,UtilsService],
  controllers: [CategoriaController]
})
export class CategoriaModule {}
