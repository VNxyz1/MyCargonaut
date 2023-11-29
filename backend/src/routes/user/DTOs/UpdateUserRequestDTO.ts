import {
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserRequestDto {
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  eMail?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
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

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  password?: string;
}
