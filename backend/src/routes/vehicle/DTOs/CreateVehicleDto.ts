import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleType } from 'src/database/VehicleType';
export class CreateVehicleDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  seats: number;

  @IsNotEmpty()
  @ApiProperty()
  type: VehicleType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  picture: string;
}
