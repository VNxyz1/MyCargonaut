import { IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetFilteredTripRequestRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'Search string to filter trip requests by description, starting location, or destination postal code.',
  })
  searchString?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter trip requests starting from the specified postal code.',
  })
  fromPLZ?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter trip requests ending at the specified postal code.',
  })
  toPLZ?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter trip requests by the number of requested seats.',
  })
  seats?: string;

  @IsOptional()
  @IsISO8601()
  @ApiProperty({
    description: 'Filter trip requests by the starting date in ISO 8601 format.',
  })
  date?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Filter trip requests by rating.' })
  rating?: number;
}
