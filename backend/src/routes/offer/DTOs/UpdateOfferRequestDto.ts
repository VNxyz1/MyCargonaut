import { ArrayMinSize, IsArray, IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRoutePartDto } from './CreateRoutePartDto';

export class UpdateOfferRequestDto {
  @IsArray()
  @ArrayMinSize(2)
  @IsOptional()
  @ApiProperty({
    required: false,
    type: [CreateRoutePartDto],
    minimum: 2,
  })
  route?: CreateRoutePartDto[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsISO8601()
  @IsOptional()
  @ApiProperty({ required: false })
  startDate?: Date;
}
