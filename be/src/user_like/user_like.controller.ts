import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shareEntire/guards/jwt-auth.guard';
import { UserLikeService } from './user_like.service';

@Controller('user-like')
export class UserLikeController {
    constructor(
        private userLikeService: UserLikeService,
  
      ){}
    @Post('like/:videoId')
    @UseGuards(AuthGuard)
    likeVideo(@Req() req: any, @Param('videoId') videoId: string ) {
        const userId = req['user_data'].id;
        return this.userLikeService.toggleVideoLike(Number(userId), Number(videoId));
    }

}
