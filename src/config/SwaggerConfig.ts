import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('Title exemple')
  .setDescription('Description exemple')
  .setVersion('1.0')
  .addTag('Usuários')
  .setVersion('1.0')
  .addBearerAuth()
  .build();