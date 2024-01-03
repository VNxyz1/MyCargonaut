import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoutePartDto {
  @IsString()
  @ApiProperty()
  plz: string;

  @IsString()
  @ApiProperty()
  location: string;

  @IsNumber()
  @ApiProperty()
  position: number;
}
