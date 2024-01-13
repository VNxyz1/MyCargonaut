import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateRoutePartDto } from '../../offer/DTOs/CreateRoutePartDto';

export class PostTransformToOfferDto {
  @IsNumber()
  @ApiProperty({
    description:
      'Seats, that the provider requires. The seats requested by the other user are added automatically',
  })
  additionalSeats: number;

  @IsString()
  @ApiProperty()
  vehicle: string;

  @IsISO8601()
  @ApiProperty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsOptional()
  @ApiProperty({
    type: [CreateRoutePartDto],
    required: false,
    description: 'You can extend the basic route if you want to.',
  })
  route?: CreateRoutePartDto[];
}
