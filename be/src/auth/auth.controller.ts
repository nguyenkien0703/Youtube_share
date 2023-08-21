import {
    Body,
    Controller, Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Post, Query,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { LoginUserDto, RefreshTokenDto } from "./dto/auth.dto";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}


    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async login(@Body() loginUserDto: LoginUserDto){

        const loginData= await this.authService.login(loginUserDto);
        return {
            success: true,
            content: loginData,
        };

    }


    @Post('refresh-token')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto){
        const newAccessToken = await this.authService.refreshToken(refreshTokenDto);
        return {
            success: true,
            content: newAccessToken,
          };
    }


}
