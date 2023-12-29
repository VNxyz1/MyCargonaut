import {
    IsNotEmpty,
    IsString,
    IsISO8601, IsArray, ArrayMinSize, IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {CreatePlzDto} from "./CreatePlzDto";
export class CreateOfferDto {

    @IsArray()
    @ArrayMinSize(2)
    @IsNotEmpty()
    @ApiProperty({
        type: [CreatePlzDto],
        minimum: 2
    })
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

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({description: "The seats already used by the provider. Should be at least one."})
    bookedSeats: number;

}
