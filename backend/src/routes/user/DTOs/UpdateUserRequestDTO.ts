import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserRequestDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  profilePicture?: string;

  @IsOptional()
  @IsPhoneNumber()
  @ApiProperty({ required: false })
  phoneNumber?: string;

  @IsOptional()
  @IsISO8601()
  @ApiProperty({ required: false })
  birthday?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;
}
