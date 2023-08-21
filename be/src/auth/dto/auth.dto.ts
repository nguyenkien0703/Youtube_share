import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}


export class LoginUserDto {
  @IsNotEmpty()
  username:string;

  @IsString()
  @IsNotEmpty()
  password:string;
}



