import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PutTransitRequestRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  offeredCoins?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  requestedSeats?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  text?: string;
}
