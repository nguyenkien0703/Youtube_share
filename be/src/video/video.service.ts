import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateVideoDto } from "./dto/create-video.dto";
import { Video } from "./entity/video.entity";
import { In, Like, Repository  } from "typeorm";
import { User } from "src/user/entitties/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FilterVideoDto } from "./dto/filter-video.dto";
import { Share } from "../share/share.entity";
import { log } from "console";
import { SocketGateway } from "../socket/socket.gateway";
import { format } from 'date-fns';
import { USER_LIKE_STATUS } from '../shareEntire/constants';
import { httpErrors } from "src/shareEntire/exception-filter/http-errors.const";
import { UserLike } from "src/user_like/entity/like.entity";

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
            throw new HttpException(httpErrors.CANNOT_CREATE_VIDEO, HttpStatus.BAD_REQUEST);
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


            await this.shareRepository.save({ userId, videoId, shareDate });
            const video = await this.videoRepository
            .createQueryBuilder("video")
            .where("video.id = :videoId", { videoId: videoId })
            .getOne();

            return { success: true, video, formattedDate};
        } catch (error) {
            return { success: false, message: "Error occurred while sharing the video." };
        }
    }

    async  getSharedVideoByUserId(userId: number,query: FilterVideoDto) : Promise<any> {

        const shares = await this.shareRepository
          .createQueryBuilder("share")
          .where("share.userId = :userId", { userId: userId })
          .getRawMany();
        const videoIds = shares.map((share) => share.share_video_id);
        const videosShare: Video[] = [];

        for (const videoId of videoIds) {
            const video = await this.videoRepository
              .createQueryBuilder("video")
              .where("video.id = :videoId", { videoId: videoId })
              .getOne();
            if (video) {
                videosShare.push(video);
            }
        }
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




