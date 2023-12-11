import {
    IsNotEmpty,
    IsString,
    IsISO8601, IsArray, ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {CreatePlzDto} from "./CreatePlzDto";
export class CreateOfferDto {

    @IsArray()
    @ArrayMinSize(2)
    @IsNotEmpty()
    @ApiProperty()
    route: CreatePlzDto[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    vehicle: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsISO8601()
    @ApiProperty()
    startDate: Date;

}
