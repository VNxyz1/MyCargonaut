import { ApiProperty } from '@nestjs/swagger';
import { TransitRequest } from '../../../database/TransitRequest';
import { GetAverageRatingsDto } from '../../rating/DTOs/GetAverageRatingsResponseDTO';

export class GetUserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  eMail: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  profilePicture: string;

  @ApiProperty()
  birthday: Date;

  @ApiProperty()
  coins: number;

  @ApiProperty()
  reservedCoins: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  entryDate: Date;

  @ApiProperty({
    type: [TransitRequest],
  })
  requestedTransits: TransitRequest[];

  @ApiProperty({ type: GetAverageRatingsDto })
  averageRatings: GetAverageRatingsDto;
}
