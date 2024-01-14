import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostTripRequestOffering {
  @ApiProperty()
  @IsNumber()
  requestedCoins: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;
}
