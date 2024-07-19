import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('Title exemple')
  .setDescription('Description exemple')
  .setVersion('1.0')
  .addTag('Login')
  .addTag('Usuários')
  .addTag("Categorias")
  .addTag("Inscrições")
  .setVersion('1.0')
  .addBearerAuth()
  .build();