import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('app-ts API')
    .setDescription('API NestJS rodando no Kubernetes')
    .setVersion('1.0')
    .addTag('app', 'Informações gerais da aplicação')
    .addTag('tasks', 'Gerenciamento de tarefas')
    .addTag('health', 'Health checks para o Kubernetes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();