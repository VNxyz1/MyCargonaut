import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LogInRequestDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  eMail: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
