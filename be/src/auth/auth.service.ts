import { Injectable,HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entitties/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto, RefreshTokenDto } from "./dto/auth.dto";
import { generateAccessToken, generateRefreshToken, hashPassword, verifyRefreshJWT } from '../shareEntire';
import { httpErrors } from 'src/shareEntire/exception-filter/http-errors.const';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) {
    }


    async login(loginUserDto : LoginUserDto): Promise<any> {
        const user = await this.userRepository.findOne(
            {
                where: {username: loginUserDto.username}
            }
        )

        if(!user){
            throw new HttpException(httpErrors.USER_NAME_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const checkPass = bcrypt.compareSync(loginUserDto.password, user.password);
        if(!checkPass){
            throw new HttpException(httpErrors.USER_PASSWORD_NOT_CORRECT,HttpStatus.UNAUTHORIZED);
        }
        //generate access_token and refresh_token
        const userId = user.id;
        const usernameUser = user.username;
        const payload = {id: userId, username:usernameUser};
        const expired_at = Date.now() + (Number(process.env.ACCESS_TOKEN_EXPIRE_IN_SEC) * 1000);
        const access_token = generateAccessToken(payload, {
            expiresIn: Number(this.configService.get('api.accessTokenExpireInSec')),
        });
        const refresh_token = generateRefreshToken(payload, {
            expiresIn: Number(this.configService.get('api.refreshTokenExpireInSec')),
        });

        return {access_token, refresh_token, expired_at,userId, usernameUser};
    }

    async refreshToken( refreshTokenDto: RefreshTokenDto): Promise<any> {
        try{

            const verifyTokenOld = await verifyRefreshJWT(refreshTokenDto.refreshToken);
            let access_token;
            let refresh_token;
            try{
                access_token =await generateAccessToken(verifyTokenOld);
                refresh_token = await generateRefreshToken(verifyTokenOld);
                return {access_token, refresh_token};
            }catch(error){
                throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
            }
        }catch(error ){
            throw new HttpException('refresh-token is not valid', HttpStatus.BAD_REQUEST);
        }
    }





  


   
}
