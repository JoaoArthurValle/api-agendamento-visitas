import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Validação global dos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS para permitir o frontend React
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN') ?? 'http://localhost:5173',
    credentials: true,
  });

  // Prefixo global da API
  app.setGlobalPrefix('api');

  // Documentação Swagger — ótimo para apresentar no TCC
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API de Agendamento de Visitas')
    .setDescription(
      'Sistema de agendamento que aceita visitas apenas em horário comercial (seg–sex, 09h–18h).',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`🚀 API rodando em http://localhost:${port}/api`);
  console.log(`📘 Swagger em      http://localhost:${port}/api/docs`);
}
bootstrap();
