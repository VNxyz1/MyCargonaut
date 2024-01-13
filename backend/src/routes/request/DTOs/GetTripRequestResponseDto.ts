import { ApiProperty } from '@nestjs/swagger';
import { Plz } from '../../../database/Plz';
import { GetOtherUserDto } from '../../offer/DTOs/GetOtherUserDto';

export class GetTripRequestResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  requester: GetOtherUserDto;

  @ApiProperty()
  startPlz: Plz;

  @ApiProperty()
  endPlz: Plz;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  cargoImg: string | null;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  seats: number;
}
