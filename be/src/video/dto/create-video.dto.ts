import { IsNotEmpty, IsString } from "class-validator";

export class CreateVideoDto {
    @IsNotEmpty()
    @IsString()
    title: string ;
    @IsString()
    @IsNotEmpty()
    url: string ;
}