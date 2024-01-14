import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleResponseDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number;
}
