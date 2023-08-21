import {
    Body,
    Controller,
    Query,
    HttpStatus,
    Post,
    Req,
    Get,
    UseGuards,
    UsePipes,
    ValidationPipe,
    Param,
    HttpCode,
    Inject, UseInterceptors,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { FilterVideoDto } from './dto/filter-video.dto';

import { Video } from "./entity/video.entity";
import { Socket } from 'socket.io';
import * as io from 'socket.io';
import { WebsocketService } from "../websocket/websocket.service";

import { log } from "console";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/shareEntire/guards/jwt-auth.guard";
import { verifyRefreshJWT } from "src/shareEntire";
import { AuthInterceptor } from '../shareEntire/interceptor/auth.interceptor';
@ApiTags('video')

@Controller('videos')

export class VideoController {


    constructor(
      private videoService: VideoService,
      private readonly websocketService: WebsocketService,

    ){}

    @Post('register')
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createVideo(@Req() req: any,@Body() createVideoDto: CreateVideoDto) {
        const videoIsCreated = await this.videoService.createVideo(req['user_data'].id,createVideoDto);
        return {
            success: true, 
            content: videoIsCreated
        }
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(AuthInterceptor)
    async findAll(@Query() query: FilterVideoDto,  @Req() req: any ){
        const userId = req.user?.id;
        const getAllVideos =  await this.videoService.findAll(query, Number(userId));
        return {
            success: true,
            content: getAllVideos
        }
    }

    @Post('share/:videoId')
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async shareVideo(@Req() req: any, @Param('videoId') videoId: string ): Promise<{ success: boolean; message?: string; video?: Video;  }>{
        const userId = req['user_data'].id;
        const videoIsShared = await this.videoService.sharedVideo(Number(userId), Number(videoId));
        if(videoIsShared.success=== true ){
            const user = req['user_data'];
            const video = videoIsShared.video;
            const shareDate =videoIsShared.formattedDate;
            this.websocketService.emitEventToAll('videoShared', {
                userId: user.id,
                videoId: video.id,
                message: {
                    text: `${user.username} đã chia sẻ video ${video.title} vào lúc ${shareDate}`,
                    data: {
                        userId: user.id,
                        videoId: video.id,
                    }
                }
            });

            return { success: true, message: "Video has shared and notification for everyone." };

        }
    }



    @Get('shared')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async getSharedAndCreateVideoByUser(@Req() req: any, @Query() query: FilterVideoDto): Promise<Video[]> {
        const userId = req['user_data'].id;
        return this.videoService.getSharedVideoByUserId(Number(userId), query);

    }
}
