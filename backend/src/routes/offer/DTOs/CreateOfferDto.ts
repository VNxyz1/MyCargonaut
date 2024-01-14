import {
  IsNotEmpty,
  IsString,
  IsISO8601,
  IsArray,
  ArrayMinSize,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRoutePartDto } from './CreateRoutePartDto';
export class CreateOfferDto {
  @IsArray()
  @ArrayMinSize(2)
  @IsNotEmpty()
  @ApiProperty({
    type: [CreateRoutePartDto],
    minimum: 2,
  })
  route: CreateRoutePartDto[];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  vehicleId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsISO8601()
  @ApiProperty()
  startDate: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The seats already used by the provider. Should be at least one.',
  })
  bookedSeats: number;
}
