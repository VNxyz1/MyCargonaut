import { ApiProperty } from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

export class PostTransitRequestRequestDto {
  @ApiProperty()
  @IsNumber()
  offeredCoins: number;

  @ApiProperty()
  @IsNumber()
  requestedSeats: number;

  @ApiProperty()
  @IsString()
  text: string;
}
