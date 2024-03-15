import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateTripRequestOffering {
  @ApiProperty()
  @IsNumber()
  requestedCoins: number;

  @ApiProperty()
  @IsString()
  text: string;
}
