import { ApiProperty } from '@nestjs/swagger';
import { GetRatingStatusDto } from './GetRatingStatusResponseDTO';

export class GetAllRatingStatusDto {
  @ApiProperty({ type: [GetRatingStatusDto] })
  ratees: GetRatingStatusDto[];
}
