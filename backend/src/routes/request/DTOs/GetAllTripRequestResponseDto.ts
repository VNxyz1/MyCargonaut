import { ApiProperty } from '@nestjs/swagger';
import { GetTripRequestResponseDto } from './GetTripRequestResponseDto';

export class GetAllTripRequestResponseDto {
  @ApiProperty({ type: [GetTripRequestResponseDto] })
  tripRequests: GetTripRequestResponseDto[];
}
