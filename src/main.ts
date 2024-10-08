import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['content-type', 'authorization'],
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api/');

  const options = new DocumentBuilder()
    .setTitle('Movies App')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'jwt',
        name: 'Access Token',
        in: 'header',
      },
      'Access Token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'jwt',
        name: 'Refresh Token',
        in: 'header',
      },
      'Refresh Token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(8000);
}
bootstrap();
