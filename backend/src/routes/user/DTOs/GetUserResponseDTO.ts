import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';
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

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  profilePicture: string;
}
