import { ApiProperty } from '@nestjs/swagger';
import { GetOtherUserDto } from './GetOtherUserDto';
import { TransitRequest } from '../../../database/TransitRequest';
import { RoutePart } from '../../../database/RoutePart';
import { CreateVehicleDto } from 'src/routes/vehicle/DTOs/CreateVehicleDto';

export class GetOfferResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({type: () => GetOtherUserDto} )
  provider: GetOtherUserDto;

  @ApiProperty({ type: [RoutePart] })
  route: RoutePart[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [GetOtherUserDto] })
  clients: GetOtherUserDto[];

  @ApiProperty()
  vehicle: CreateVehicleDto;

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
