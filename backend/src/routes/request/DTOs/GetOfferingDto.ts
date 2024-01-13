import { GetOtherUserDto } from '../../offer/DTOs/GetOtherUserDto';
import { GetTripRequestResponseDto } from './GetTripRequestResponseDto';
import { ApiProperty } from '@nestjs/swagger';

export class GetOfferingDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  requestedCoins: number;
  @ApiProperty()
  text: string;
  @ApiProperty({ type: GetOtherUserDto })
  offeringUser: GetOtherUserDto;
  @ApiProperty({ type: GetTripRequestResponseDto })
  tripRequest: GetTripRequestResponseDto;
  @ApiProperty()
  accepted: boolean;
}
