import { Module } from '@nestjs/common';
import { InscricaoService } from './inscricao.service';
import { InscricaoController } from './inscricao.controller';

@Module({
  providers: [InscricaoService],
  controllers: [InscricaoController]
})
export class InscricaoModule {}
