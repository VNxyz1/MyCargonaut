import { IsInt, IsISO8601, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GetAverageRatingsDto } from '../../rating/DTOs/GetAverageRatingsResponseDTO';
import { GetOfferResponseDto } from './GetOfferResponseDto';
import { GetTripRequestResponseDto } from '../../request/DTOs/GetTripRequestResponseDto';

export class GetOtherUserDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @ApiProperty()
  profilePicture: string;

  @IsISO8601()
  @ApiProperty()
  entryDate: Date;

  @ApiProperty()
  age: number;

  @ApiProperty()
  phoneNumberProvided: boolean;

  @ApiProperty({ type: GetAverageRatingsDto })
  averageRatings: GetAverageRatingsDto;

  @ApiProperty({ type: [GetOfferResponseDto] })
  offers: GetOfferResponseDto[];

  @ApiProperty({ type: [GetTripRequestResponseDto] })
  tripRequests: GetTripRequestResponseDto[];
}
