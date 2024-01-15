import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTripMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message: string;

  @IsISO8601()
  @ApiProperty()
  timestamp: string;
}
