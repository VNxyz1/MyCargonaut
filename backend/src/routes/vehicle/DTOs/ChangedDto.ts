import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleType } from '../../../database/VehicleType';

export class ChangedDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  seats?: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  type?: VehicleType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  picture?: string;
}
