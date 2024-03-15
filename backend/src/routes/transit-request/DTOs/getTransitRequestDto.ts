import { ApiProperty } from '@nestjs/swagger';
import { GetOfferResponseDto } from '../../offer/DTOs/GetOfferResponseDto';
import { User } from '../../../database/User';
import { GetOtherUserDto } from '../../offer/DTOs/GetOtherUserDto';

export class GetTransitRequestDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: [User, GetOtherUserDto] })
  requester: User | GetOtherUserDto;

  @ApiProperty({ type: GetOfferResponseDto })
  offer: GetOfferResponseDto;

  @ApiProperty()
  text: string;

  @ApiProperty()
  offeredCoins: number;

  @ApiProperty()
  requestedSeats: number;
}
