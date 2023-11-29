import {
  IsEmail,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponseDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  eMail: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @ApiProperty()
  profilePicture: string;

  @IsISO8601()
  @ApiProperty()
  birthday: Date;

  @IsNumber()
  @ApiProperty()
  coins: number;
}
