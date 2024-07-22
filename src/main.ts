import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { config } from './config/SwaggerConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('/docs',app,document)
  

  await app.listen(3000);
}
bootstrap();
