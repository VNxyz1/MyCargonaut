import { IsInt, IsNumber } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  export class GetAverageRatingsDto {
    @IsInt()
    @ApiProperty()
    amount: number;

    @IsNumber()
    @ApiProperty()
    total: number;

    @IsNumber()
    @ApiProperty()
    punctuality: number;

    @IsNumber()
    @ApiProperty()
    reliability: number;

    @IsNumber()
    @ApiProperty()
    comfortDuringTrip: number;

    @IsNumber()
    @ApiProperty()
    cargoArrivedUndamaged: number;

    @IsNumber()
    @ApiProperty()
    passengerPleasantness: number;
  }