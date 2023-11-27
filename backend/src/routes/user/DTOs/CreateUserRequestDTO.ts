import {IsEmail, IsNotEmpty, IsOptional, IsString, Matches} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
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
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Der Benutzername darf keine Sonderzeichen enthalten.' })
    @ApiProperty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @IsOptional()
    @ApiProperty()
    profilePicture?: string;

}
