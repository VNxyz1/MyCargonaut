import { IsISO8601, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetFilteredTripRequestRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  searchString?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  fromPLZ?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  toPLZ?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  seats?: string;

  @IsOptional()
  @IsISO8601()
  @ApiProperty()
  date?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  rating?: string;
}
