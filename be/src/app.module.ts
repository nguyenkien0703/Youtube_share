import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { VideoModule } from "./video/video.module";
import { WebsocketModule } from "./websocket/websocke.module";
import { SocketModule } from './socket/socket.module';
import { UserLikeController } from './user_like/user_like.controller';
import { UserLikeModule } from './user_like/user_like.module';
import configuration from './shareEntire/config/configuration';
import { DatabaseModule } from 'db/data-source';
@Module({
  imports: [
    // TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    UserModule, 
    AuthModule,
    ConfigModule.forRoot() ,
    VideoModule,
    WebsocketModule,
    SocketModule,
    UserLikeModule,
  ],
  controllers: [AppController, UserLikeController],
  providers: [
    AppService,
  ]

})
export class AppModule {}
