import { Module } from '@nestjs/common';
import { RecuperaSenhaService } from './recupera-senha.service';
import { RecuperaSenhaController } from './recupera-senha.controller';

@Module({
  providers: [RecuperaSenhaService],
  controllers: [RecuperaSenhaController]
})
export class RecuperaSenhaModule {}
