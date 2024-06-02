import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { EnvService } from './infra/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(EnvService);
  const PORT = configService.get('PORT');
  const SERVICE = configService.get('SERVICE');
  const VERSION = configService.get('VERSION');

  const config = new DocumentBuilder()
    .setTitle('Auto Cars - Backend')
    .setDescription('Cars seller API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter token',
        in: 'header',
      },
      'KEY_AUTH',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger/docs', app, document);

  await app.listen(PORT, () => {
    console.log(`${SERVICE} - ${VERSION} - Listening on port ${PORT} 🚀`);
  });
}
bootstrap();
