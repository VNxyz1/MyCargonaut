import { IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class GetRatingStatusDto {
  @IsBoolean()
  @ApiProperty({ description: 'already rated this user' })
  rated: boolean;

  @IsInt()
  @ApiProperty({ description: 'user who can be rated' })
  rateeId: number;
}