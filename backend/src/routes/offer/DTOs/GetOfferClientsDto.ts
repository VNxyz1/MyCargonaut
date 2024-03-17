import { IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
