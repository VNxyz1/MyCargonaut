import { IsInt, IsISO8601, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GetAverageRatingsDto } from 'src/routes/rating/DTOs/GetAverageRatingsResponseDTO';
import { GetUserRatingsDto } from 'src/routes/rating/DTOs/GetUserRatingsResponseDTO';

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

  @ApiProperty({ type: GetAverageRatingsDto })
    averageRatings: GetAverageRatingsDto;

  @ApiProperty({ type: GetUserRatingsDto })
    totalRatings: GetUserRatingsDto;
}
