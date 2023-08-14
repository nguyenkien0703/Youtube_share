import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateVideoDto } from "./dto/create-video.dto";
import { Video } from "./entity/video.entity";
import { In, Like, Repository  } from "typeorm";
import { User } from "src/user/entitties/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FilterVideoDto } from "./dto/filter-video.dto";
import { UserLike } from "../user_like/like.entity";
import { Share } from "../share/share.entity";
import { log } from "console";
import { USER_LIKE_STATUS } from "../utils/constants";
import { SocketGateway } from "../socket.gateway";
import { format } from 'date-fns';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Video) private videoRepository: Repository<Video>,
        @InjectRepository(UserLike) private userLikeRepository: Repository<UserLike>,
        @InjectRepository(Share) private shareRepository: Repository<Share>,
        private  socketGateway: SocketGateway,
    ){}

    async createVideo(userId: number, createVideoDto: CreateVideoDto): Promise<Video> {
        const user = await this.userRepository.findOneBy({id: userId});
        try{
            const res = await this.videoRepository.save({
                ...createVideoDto, user
            })
            return await this.videoRepository.findOneBy({id: res.id});
        }catch(error ){
            throw new HttpException('can not create video', HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(query: FilterVideoDto,userId?: number ): Promise<any> {
        const _limit = Number(query._limit) || 10 ;
        const _page = Number(query._page) || 1;
        const search = query.search|| '';
        const skip = (_page-1 ) * _limit;
        const [res,total] = await this.videoRepository.findAndCount({
            where: [
                {
                    title:Like('%' + search+'%')
                }
            ],
            order: {createdAt:"ASC"},
            take: _limit,
            skip: skip,
        })
        const videosWithStatus = await Promise.all(
          res.map(async (video)=> {
              const videoWithStatus = {
                  ...video,
                  reactVideo : null,
              };
              if(userId){
                  const existingLike = await this.userLikeRepository
                    .createQueryBuilder("userLike")
                    .where("userLike.userId = :userId", { userId: userId })
                    .andWhere("userLike.videoId = :videoId", { videoId: video.id })
                    .getOne();
                    
                  if (existingLike) {
                      if (existingLike.status === USER_LIKE_STATUS.LIKE) {
                          videoWithStatus.reactVideo = true;
                      } else if (existingLike.status === USER_LIKE_STATUS.UNLIKE) {
                          videoWithStatus.reactVideo = false;
                      }
                  }else {
                      videoWithStatus.reactVideo = null;
                  }
              }
              return videoWithStatus;
          })
        )

        const pagination = {
            _page: _page,
            _limit: _limit,
            _totalRows: total,
        };
        return {
            data: videosWithStatus,
            pagination: pagination,
        };
    }


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
            throw new HttpException("video with videoId not exist", HttpStatus.NOT_FOUND);
        }
    }



// ======================handle user  shared video and send notification for every one ========
    async sharedVideo(userId: number, videoId: number): Promise<any> {
        try {
            // check whether video was shared? avoid case video shared duplicated by user
            const isVideo = await this.videoRepository
              .createQueryBuilder("video")
              .where("video.id = :videoId", { videoId: videoId })
              .getOne();

            if (!isVideo) {

                return { success: false, message: "Video is not exist." };
            }
            const shareDate = new Date();
            const formattedDate = format(shareDate, "EEE MMM dd yyyy HH:mm:ss");
            console.log(formattedDate);
            await this.shareRepository.save({ userId, videoId, shareDate });
            const video = await this.videoRepository
            .createQueryBuilder("video")
            .where("video.id = :videoId", { videoId: videoId })
            .getOne();

            return { success: true, video, formattedDate};
        } catch (error) {
            console.error("Error in sharedVideo:", error);
            return { success: false, message: "Error occurred while sharing the video." };
        }
    }

    async  getSharedVideoByUserId(userId: number,query: FilterVideoDto) : Promise<any> {

        // const shares = await this.shareRepository
        //   .createQueryBuilder("share")
        //   .select('share.videoId')
        //   .leftJoin('share.videoId', 'video')
        //   .addSelect('video.id')
        //   .where("share.userId = :userId", { userId: userId })
        //   .getRawMany();

        const shares = await this.shareRepository
          .createQueryBuilder("share")
          .where("share.userId = :userId", { userId: userId })
          .getRawMany();
        console.log("shares     ", shares);
        const videoIds = shares.map((share) => share.share_video_id);
        console.log("videoIds    ", videoIds);
        const videosShare: Video[] = [];
        for (const videoId of videoIds) {
            const video = await this.videoRepository
              .createQueryBuilder("video")
              .where("video.id = :videoId", { videoId: videoId })
              .getOne();
            console.log("video   ", video);
            if (video) {
                videosShare.push(video);
            }
        }




        console.log("videosShare     ", videosShare );
        const _page = Number(query._page) || 1;
        const search = query.search || '';
        const filteredVideos = search
          ? videosShare.filter(video => video.title.includes(search))
          : videosShare;

        const total = filteredVideos.length;
        const _limit = Number(query._limit) || 10 ;
        const lastPage = Math.ceil(total/_limit);
        const skip = (_page-1 ) * _limit;
        const dataResponse = filteredVideos.slice(skip, skip + _limit);
        console.log("dataResponse   ", dataResponse);
        const pagination = {
            _page: _page,
            _limit: _limit,
            _totalRows: total,
        };
        return {
            data: dataResponse,
            pagination: pagination,
        };


    }
}




