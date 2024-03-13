import { CreatePlzDto } from '../../offer/DTOs/CreatePlzDto';
import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostTripRequestRequestDto {
  @IsNotEmpty()
  @ApiProperty({ type: CreatePlzDto })
  startPlz: CreatePlzDto;

  @IsNotEmpty()
  @ApiProperty({ type: CreatePlzDto })
  endPlz: CreatePlzDto;

  @IsOptional()
  @ApiProperty({ required: false, description: 'An image fie of the cargo.' })
  cargoImg?: any;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsISO8601()
  @ApiProperty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  seats: string;
}
