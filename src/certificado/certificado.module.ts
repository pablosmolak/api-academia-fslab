import { Module } from '@nestjs/common';
import { CertificadoService } from './certificado.service';
import { CertificadoController } from './certificado.controller';

@Module({
  providers: [CertificadoService],
  controllers: [CertificadoController]
})
export class CertificadoModule {}
