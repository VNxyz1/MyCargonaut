import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePlzDto } from '../../offer/DTOs/CreatePlzDto';

export class UpdateTripRequestRequestDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ type: CreatePlzDto })
  startPlz?: CreatePlzDto;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ type: CreatePlzDto })
  endPlz?: CreatePlzDto;

  @IsOptional()
  @ApiProperty({ type: File, description: 'An image fie of the cargo.' })
  cargoImg?: File;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @IsISO8601()
  @ApiProperty()
  startDate?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  seats?: number;

  cargoImgString?: string | undefined;
}
