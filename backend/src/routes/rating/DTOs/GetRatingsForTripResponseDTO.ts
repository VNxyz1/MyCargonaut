import { ApiProperty } from '@nestjs/swagger';
import { GetRatingDto } from './GetRatingResponseDTO';

export class GetRatingsForTripRequestsResponseDTO {
    @ApiProperty({ type: [GetRatingDto] })
    driverRatings: GetRatingDto[];

    @ApiProperty({ type: [GetRatingDto] })
    passengerRatings: GetRatingDto[];
}