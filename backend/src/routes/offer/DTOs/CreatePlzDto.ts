import {IsNumber, IsOptional} from "class-validator";

export class CreatePlzDto {

    @IsNumber()
    @IsOptional()
    plz: number;

}