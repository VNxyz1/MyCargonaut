import { IsISO8601, IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetFilteredOffersDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'A search string to filter offers by.',
    required: false,
  })
  searchString?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'The starting postal code for filtering offers by location. You have to specify fromPLZ and toPLZ.',
    required: false,
  })
  fromPLZ?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'The ending postal code for filtering offers by location. You have to specify fromPLZ and toPLZ.',
    required: false,
  })
  toPLZ?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'A number of seats to filter offers by. Returns offers with the requested number of available seats or more.',
    required: false,
  })
  seats?: string;

  @IsOptional()
  @IsISO8601()
  @ApiProperty({
    description: 'A date to filter offers by. Must be in the format YYYY-MM-DD.',
    required: false,
  })
  date?: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    description: 'A rating to filter offers by. Must be between 0 and 5.',
    required: false,
  })
  rating?: string;
}
