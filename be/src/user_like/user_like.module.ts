import { Module } from '@nestjs/common';
import { UserLikeService } from './user_like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from '../video/entity/video.entity';

import { UserLike } from './entity/like.entity';

import { ConfigModule } from '@nestjs/config';
import { UserLikeController } from './user_like.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Video ,UserLike]),
    ConfigModule,
  ],
  controllers: [UserLikeController]
  ,
  providers: [UserLikeService],
  exports: [UserLikeService]
})
export class UserLikeModule {}
