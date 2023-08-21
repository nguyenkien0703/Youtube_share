import { Body, Controller, UseGuards, Post, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entitties/user.entity';
import { RegisterUserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService){

    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    async register(@Body() registerUserDto:RegisterUserDto) {
      
        const registerUser = await this.userService.register(registerUserDto);
        return {
            success: true, 
            content: registerUser
        }
    }





}
