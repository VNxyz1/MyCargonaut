import {GetOfferResponseDto} from "./GetOfferResponseDto";
import {ApiProperty} from "@nestjs/swagger";

export  class GetAllOffersResponseDto {

    @ApiProperty({type: [GetOfferResponseDto]})
    offerList: GetOfferResponseDto[]
}