import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shareEntire/exception-filter/http-exeption.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  const configSwagger = new DocumentBuilder()
    .setTitle('Blockchain youtube')
    .setDescription("list api for simple youtube application by Kien dev")
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('video')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);

  const port = config.get('api.port');
  const server = await app.listen(port);
  const ioAdapter = new IoAdapter(server);
  app.useWebSocketAdapter(ioAdapter);

}
bootstrap();
