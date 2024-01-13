import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumberOrEmptyString } from '../../utils/custom_validators';
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
  @IsPhoneNumberOrEmptyString('phoneNumber')
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
