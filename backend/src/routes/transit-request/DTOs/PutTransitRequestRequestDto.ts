import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsOptional} from "class-validator";


export class PutTransitRequestRequestDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    offeredCoins?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    requestedSeats?: number;
}