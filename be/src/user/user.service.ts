import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entitties/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from '../shareEntire';
import { RegisterUserDto } from './dto/user.dto';
@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>  ){}

    async register(registerUserDto: RegisterUserDto): Promise<User> {

        const usernameErrors  = await this.getUsernameAvailability(registerUserDto.username);
        const emailErrors  = await this.getEmailAvailability(registerUserDto.email);

        if(usernameErrors.length > 0 || emailErrors.length > 0){
            const errors = [...usernameErrors, ...emailErrors];
            throw new HttpException({ message: 'Validation failed', errors }, HttpStatus.BAD_REQUEST);
        }

        const hashPassworded = await hashPassword(registerUserDto.password);
        return await this.userRepository.save({ ...registerUserDto, password: hashPassworded });
    }



    async getUsernameAvailability(username: string): Promise<string[]> {
        const errors: string[] = [];
        const userWithSameUsername = await this.userRepository.findOne({ where: { username } });

        if (userWithSameUsername) {
            errors.push('Username is already taken');
        }

        return errors;
    }
    async getEmailAvailability(email: string): Promise<string[]> {
        const errors: string[] = [];
        const userWithSameEmail = await this.userRepository.findOne({ where: { email } });

        if (userWithSameEmail) {
            errors.push('Email is already taken');
        }

        return errors;
    }

}
