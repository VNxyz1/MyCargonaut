import { IsInt, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GetRatingStatusDto } from './GetRatingStatusResponseDTO';

export class GetAllRatingStatusDto {
    @ApiProperty({ type: [GetRatingStatusDto] })
    ratees: GetRatingStatusDto[];
}