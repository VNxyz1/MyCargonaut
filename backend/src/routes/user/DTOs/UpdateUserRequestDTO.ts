import {IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
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

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    username?: string;

    @IsOptional()
    @ApiProperty({ required: false })
    profilePicture?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    password?: string;

}
