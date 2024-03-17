import { IsNotEmpty, IsString, IsISO8601, IsArray, ArrayMinSize, IsNumber, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRoutePartDto } from './CreateRoutePartDto';
import { VehicleExistsValidator } from '../../utils/custom_validators';
import { GetOtherUserDto } from './GetOtherUserDto';
export class GetOfferClientsDto {
  @IsArray()
  @ArrayMinSize(0)
  @ApiProperty({
    type: [GetOtherUserDto],
    minimum: 2,
  })
  clients: GetOtherUserDto[];

}
