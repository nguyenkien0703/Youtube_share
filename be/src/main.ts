import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, 
  });


  const config = new DocumentBuilder()
    .setTitle('Blockchain youtube')
    .setDescription("list api for simple youtube application by Kien dev")
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('video')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const server = await app.listen(5000);
  const ioAdapter = new IoAdapter(server);
  app.useWebSocketAdapter(ioAdapter);

}
bootstrap();
