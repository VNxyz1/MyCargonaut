import { CreateVehicleDto } from './CreateVehicleDto';
import { ApiProperty } from '@nestjs/swagger';

export class GetVehicleResponseDto {
  @ApiProperty({ type: [CreateVehicleDto] })
  vehicleList: CreateVehicleDto[];
}
