import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { Video } from './entity/video.entity';
import { User } from 'src/user/entitties/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Share } from "../share/share.entity";
import { WebsocketService } from "../websocket/websocket.service";
import { SocketGateway } from "../socket/socket.gateway";
import { WebsocketModule } from "../websocket/websocke.module";
import { SocketModule } from 'src/socket/socket.module';
import { UserLike } from 'src/user_like/entity/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video, User,UserLike,Share]),
    ConfigModule,
    WebsocketModule,
    SocketModule
  ],

  controllers: [VideoController],
  providers: [
    VideoService
  ]
})
export class VideoModule {}
