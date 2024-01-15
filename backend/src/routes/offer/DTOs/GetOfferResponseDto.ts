import { ApiProperty } from '@nestjs/swagger';
import { GetOtherUserDto } from './GetOtherUserDto';
import { TransitRequest } from '../../../database/TransitRequest';
import { RoutePart } from '../../../database/RoutePart';

export class GetOfferResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => GetOtherUserDto })
  provider: GetOtherUserDto;

  @ApiProperty({ type: [RoutePart] })
  route: RoutePart[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [GetOtherUserDto] })
  clients: GetOtherUserDto[];

  @ApiProperty()
  vehicle: string;

  @ApiProperty()
  bookedSeats: number;

  @ApiProperty()
  state: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty({ description: 'only available for providers' })
  transitRequests: TransitRequest[];
}
