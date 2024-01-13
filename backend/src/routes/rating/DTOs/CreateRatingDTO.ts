import {
    IsInt,
    IsOptional,
    Min,
    Max,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  export class CreateRatingDto {
    @IsOptional()
    @IsInt()
    @ApiProperty({ description: 'passenger that should be rated' })
    rateeId: number;

    @IsInt()
    @Min(1)
    @Max(5)
    @ApiProperty()
    punctuality: number;

    @IsInt()
    @Min(1)
    @Max(5)
    @ApiProperty()
    reliability: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    @ApiProperty()
    comfortDuringTrip: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    @ApiProperty()
    cargoArrivedUndamaged: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    @ApiProperty()
    passengerPleasantness: number;
  }