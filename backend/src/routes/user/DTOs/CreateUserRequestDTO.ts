import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsISO8601,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserRequestDto {
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

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsISO8601()
  @IsNotEmpty()
  @ApiProperty()
  birthday: Date;

  @IsOptional()
  @ApiProperty()
  profilePicture?: string;

  @IsOptional()
  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber?: string;
}
