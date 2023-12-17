import { ApiProperty } from '@nestjs/swagger';
import {GetOtherUserDto} from "./GetOtherUserDto";
import {Plz} from "../../../database/Plz";

export class GetOfferResponseDto {

    @ApiProperty()
    id: number;

    @ApiProperty({type: GetOtherUserDto})
    provider: GetOtherUserDto;

    @ApiProperty({type: [Plz]})
    route: Plz[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({type: [GetOtherUserDto]})
    clients: GetOtherUserDto[]

    @ApiProperty()
    vehicle: string

    @ApiProperty()
    bookedSeats: number

    @ApiProperty()
    state: number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    startDate: Date;

}
