import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoutePartDto {
  @IsString()
  @ApiProperty()
  plz: string;

  @IsNumber()
  @ApiProperty()
  position: number;
}
