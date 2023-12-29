import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class PostTransitRequestRequestDto {
    @ApiProperty()
    @IsNumber()
    offeredCoins: number;

    @ApiProperty()
    @IsNumber()
    requestedSeats: number;
}