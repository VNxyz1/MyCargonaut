import {
    IsNotEmpty,
    IsString,
    IsISO8601, IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {CreatePlzDto} from "./CreatePlzDto";
export class CreateOfferDto {

    @IsArray()
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
