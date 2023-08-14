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
    Inject
} from "@nestjs/common";
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { FilterVideoDto } from './dto/filter-video.dto';
import { AuthGuard } from "../auth/auth.guard";
import { Video } from "./entity/video.entity";
import { Socket } from 'socket.io';
import * as io from 'socket.io';
import { WebsocketService } from "../websocket/websocket.service";
import { verifyRefreshJWT } from "../utils/constants";
import { log } from "console";
import { ApiTags } from "@nestjs/swagger";
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
    createVideo(@Req() req: any,@Body() createVideoDto: CreateVideoDto) {
        const videoIsCreated =  this.videoService.createVideo(req['user_data'].id,createVideoDto);
        return {
            // success: true, 
            content: videoIsCreated
        }
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() query: FilterVideoDto,  @Req() req: any ): Promise<any> {
        const tokenHeader = req.headers.authorization;
        let userId = null;
        if (tokenHeader) {
            const token = tokenHeader.split(' ')[1];

            try {
                const payload = await verifyRefreshJWT(token);

                if (typeof payload === 'object' && 'id' in payload) {
                    userId = payload.id;
                }
            } catch (error) {
                return {
                    message: 'Token verification failed',
                };
            }
        }
        return await this.videoService.findAll(query, Number(userId));


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
            console.log("user     ", user);

            const video = videoIsShared.video;
            console.log("video     ", video);
            const shareDate =videoIsShared.formattedDate;
            console.log("shareDate   ", shareDate);
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


    @Post('like/:videoId')
    @UseGuards(AuthGuard)
    likeVideo(@Req() req: any, @Param('videoId') videoId: string ) {
        const userId = req['user_data'].id;
        return this.videoService.toggleVideoLike(Number(userId), Number(videoId));
    }

    // @Post('unlike/:videoId')
    // @UseGuards(AuthGuard)
    // unLikeVideo(@Req() req: any, @Param('videoId') videoId: string ) {
    //     const userId = req['user_data'].id;
    //     return this.videoService.unlikeVideo(Number(userId), Number(videoId));

    // }

}
