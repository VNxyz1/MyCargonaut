import {ApiProperty} from "@nestjs/swagger";


export class PostAndPutTransitRequestRequestDto {
    @ApiProperty()
    offeredCoins: number;
}