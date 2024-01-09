import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlzDto {
  @IsNumber()
  @ApiProperty()
  plz: string;
}
