import { ApiProperty } from '@nestjs/swagger';
import { GetRatingDto } from './GetRatingResponseDTO';

export class GetUserRatingsDto {
  @ApiProperty({ type: [GetRatingDto] })
  ratingsAsDriver: GetRatingDto[];

  @ApiProperty({ type: [GetRatingDto] })
  ratingsAsPassenger: GetRatingDto[];
}
