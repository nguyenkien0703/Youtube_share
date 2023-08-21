import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    username: string ;
  
    @IsNotEmpty()
    @IsEmail()
    email: string ;
  
  
    @IsString()
    @IsNotEmpty()
    password: string ;
    
    @IsString()
    @IsOptional()
    phone_number: string ;
    
    @IsString()
    @IsOptional()
    date_of_birth: string ;
  
  }