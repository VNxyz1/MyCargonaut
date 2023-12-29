import {ApiProperty} from "@nestjs/swagger";
import {GetOfferResponseDto} from "../../offer/DTOs/GetOfferResponseDto";
import {User} from "../../../database/User";

export class GetTransitRequestDto {
    @ApiProperty()
    id: number;

    @ApiProperty({type: User})
    requester: User;

    @ApiProperty({type: GetOfferResponseDto})
    offer: GetOfferResponseDto;

    @ApiProperty()
    offeredCoins: number;

    @ApiProperty()
    requestedSeats: number;

}