import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from 'db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoModule } from "./video/video.module";
import { WebsocketModule } from "./websocket/websocke.module";
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule, 
    AuthModule,
    ConfigModule.forRoot() ,
    VideoModule,
    WebsocketModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ]

})
export class AppModule {}
