import { IsInt, IsNumber, IsOptional, IsISO8601, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class GetRatingDto {
  @IsInt()
  @ApiProperty({ description: 'user who gave the rating' })
  raterId: number;

  @IsInt()
  @ApiProperty({ description: 'user who received the rating' })
  rateeId: number;

  @IsInt()
  @ApiProperty()
  tripId: number;

  @IsISO8601()
  @ApiProperty()
  tripDate: string;

  @IsNumber()
  @ApiProperty()
  totalRating: number;

  @IsInt()
  @ApiProperty()
  punctuality: number;

  @IsInt()
  @ApiProperty()
  reliability: number;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  comfortDuringTrip: number;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  cargoArrivedUndamaged: number;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  passengerPleasantness: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  comment: string;
}
