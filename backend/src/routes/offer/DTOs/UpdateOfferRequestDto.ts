import {ArrayMinSize, IsArray, IsISO8601, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {CreatePlzDto} from "./CreatePlzDto";

export class UpdateOfferRequestDto {

    @IsArray()
    @ArrayMinSize(2)
    @IsOptional()
    @ApiProperty({
        required: false,
        type: [CreatePlzDto],
        minimum: 2
    })
    route?: CreatePlzDto[];

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({ required: false })
    description?: string;

    @IsISO8601()
    @IsOptional()
    @ApiProperty({ required: false })
    startDate?: Date;
}