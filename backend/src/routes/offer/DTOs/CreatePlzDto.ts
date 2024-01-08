import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlzDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  plz: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  location: string;
}
