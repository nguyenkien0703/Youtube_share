import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { USER_LIKE_STATUS } from 'src/shareEntire';
import { UserLike } from './entity/like.entity';
import { Video } from 'src/video/entity/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { httpErrors } from 'src/shareEntire/exception-filter/http-errors.const';

@Injectable()
export class UserLikeService {

    constructor(
        @InjectRepository(Video) private videoRepository: Repository<Video>,
        @InjectRepository(UserLike) private userLikeRepository: Repository<UserLike>,


    ){}
// ===============handle likeCount,every video=================
async  toggleVideoLike(userId: number, videoId: number) {
    const existingLike = await this.userLikeRepository
        .createQueryBuilder("userLike")
        .where("userLike.userId = :userId", { userId: userId })
        .andWhere("userLike.videoId = :videoId", { videoId: videoId })
        .getOne();

    const video = await this.videoRepository
        .createQueryBuilder("video")
        .where("video.id = :videoId", { videoId: videoId })
        .getOne();
    
    if (video) {
        if (existingLike && existingLike.status === USER_LIKE_STATUS.LIKE) {
            // User đã ấn like, chuyển thành unlike và giảm likeCount của video
            video.likeCount -=1 ; 
            await video.save();

            existingLike.status = USER_LIKE_STATUS.UNLIKE;
            await existingLike.save();
        } else if(existingLike && existingLike.status === USER_LIKE_STATUS.UNLIKE){
            // user đã ấn unlike ròi, ấn thêm 1 cái nữa thì staus của video là null
            await existingLike.remove(); 

        }
        else {
            // User chưa ấn like , tăng likeCount của video
            video.likeCount += 1;
            await video.save();
            const newLike = new UserLike();
            newLike.userId = userId;
            newLike.videoId = videoId;
            newLike.status = USER_LIKE_STATUS.LIKE;
            await newLike.save();
        }    
            
        
    } else {
        throw new HttpException(httpErrors.VIDEO_WITH_ID_NOT_EXIST, HttpStatus.NOT_FOUND);
    }
}


}
