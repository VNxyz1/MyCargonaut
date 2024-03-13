import { CreatePlzDto } from '../../offer/DTOs/CreatePlzDto';
import { IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostTripRequestRequestDto {
  @IsNotEmpty()
  @ApiProperty({ type: CreatePlzDto })
  startPlz: CreatePlzDto;

  @IsNotEmpty()
  @ApiProperty({ type: CreatePlzDto })
  endPlz: CreatePlzDto;

  @IsOptional()
  @ApiProperty({ description: 'An image fie of the cargo.' })
  cargoImg?: any;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsISO8601()
  @ApiProperty()
  startDate: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  seats: number;
}
