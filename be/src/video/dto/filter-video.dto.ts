import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty,   IsOptional,IsNumber, IsString } from "class-validator";

export class FilterVideoDto {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    _page: number ;
    
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    _limit: number ;

    @IsString()
    @IsOptional()
    search: string ;
    
}