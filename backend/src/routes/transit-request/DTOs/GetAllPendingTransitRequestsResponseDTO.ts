import { ApiProperty } from '@nestjs/swagger';
import { GetTransitRequestDto } from './getTransitRequestDto';

export class GetAllPendingTransitRequestsResponseDTO {
  @ApiProperty({ type: [GetTransitRequestDto] })
  transitRequests: GetTransitRequestDto[];
}
