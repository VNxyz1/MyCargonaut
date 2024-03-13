import { IsNotEmpty, IsString, IsISO8601, IsArray, ArrayMinSize, IsNumber, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRoutePartDto } from './CreateRoutePartDto';
import { VehicleExistsValidator } from '../../utils/custom_validators';
export class CreateOfferDto {
  @IsArray()
  @ArrayMinSize(2)
  @IsNotEmpty()
  @ApiProperty({
    type: [CreateRoutePartDto],
    minimum: 2,
  })
  route: CreateRoutePartDto[];

  @IsNumber()
  @IsNotEmpty()
  @Validate(VehicleExistsValidator)
  @ApiProperty()
  vehicleId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsISO8601()
  @ApiProperty()
  startDate: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The seats already used by the provider. Should be at least one.',
  })
  bookedSeats: number;
}
