import { Module } from '@nestjs/common';
import { InscricaoService } from './inscricao.service';
import { InscricaoController } from './inscricao.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  providers: [InscricaoService, PrismaService, UtilsService],
  controllers: [InscricaoController]
})
export class InscricaoModule {}
