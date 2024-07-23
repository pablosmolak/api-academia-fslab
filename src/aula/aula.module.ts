import { Module } from '@nestjs/common';
import { AulaService } from './aula.service';
import { AulaController } from './aula.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  providers: [AulaService, PrismaService,UtilsService],
  controllers: [AulaController]
})
export class AulaModule {}
