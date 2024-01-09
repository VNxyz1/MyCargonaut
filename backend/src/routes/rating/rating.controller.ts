import { Controller, Get, Post, Body, Session, UseGuards, Param, ForbiddenException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RatingService } from '../rating.service/rating.service';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { CreateRatingDto } from './DTOs/CreateRatingDTO';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { ISession } from '../../utils/ISession';
import { Rating } from '../../database/Rating';
import { Offer } from '../../database/Offer';
import { UserService } from '../user.service/user.service';
import { OfferService } from '../offer.service/offer.service';
import { TripState } from '../../database/TripState';
import { GetRatingDto } from './DTOs/GetRatingResponseDTO';
import { GetRatingsForTripRequestsResponseDTO } from './DTOs/GetRatingsForTripResponseDTO';

@ApiTags('rating')
@Controller('rating')
export class RatingController {
    constructor(
        private readonly ratingService: RatingService, 
        private readonly userService: UserService,
        private readonly offerService: OfferService,
    ) {}

    @UseGuards(IsLoggedInGuard)
    @Get(':tripId')
    @ApiOperation({
        summary: 'Gets ratings for a trip',
        description: `Allows a logged-in user to get all ratings for a completed trip.`,
    })
    @ApiResponse({ type: GetRatingsForTripRequestsResponseDTO })
    @ApiResponse({
        status: 403,
        type: ForbiddenException,
        description: 'The trip is not finished yet.',
    })
    async getRatingsForTrip(@Param('tripId') tripId: number) {
        const trip = await this.offerService.getOffer(tripId);
        const ratings = await this.ratingService.selectRatingsForRatedTrip(tripId);

        if(trip.state != TripState.finished) {
            throw new ForbiddenException(false, 'The trip is not finished yet.');
        }

        if(ratings.length == 0) {
            throw new ForbiddenException(false, 'Not all users have rated this trip yet.');
        }

        const response: GetRatingsForTripRequestsResponseDTO = new GetRatingsForTripRequestsResponseDTO();
        response.passengerRatings = [];
        response.driverRatings = [];
        ratings.forEach((rating) => {
            const ratingDto: GetRatingDto = new GetRatingDto();
            ratingDto.rateeId = rating.rated.id;
            ratingDto.raterId = rating.rater.id;
            ratingDto.tripId = rating.trip.id;
            ratingDto.punctuality = rating.punctuality;
            ratingDto.reliability = rating.reliability;

            if(rating.driver) {
                ratingDto.cargoArrivedUndamaged = rating.cargoArrivedUndamaged;
                ratingDto.passengerPleasantness = rating.passengerPleasantness;
                response.driverRatings.push(ratingDto);
            } else {
                ratingDto.comfortDuringTrip = rating.comfortDuringTrip;
                response.passengerRatings.push(ratingDto);
            }
        });
        return response;
    }

    @UseGuards(IsLoggedInGuard)
    @Post(':tripId')
    @ApiOperation({
        summary: 'Creates a Ranking',
        description: `Allows a logged-in user to rate another user on a finished trip.`,
    })
    @ApiResponse({
    status: 201,
    type: OKResponseWithMessageDTO,
    description: 'Rating created successfully.',
    })
    @ApiResponse({
    status: 403,
    type: ForbiddenException,
    description: 'Forbidden: You cannot rate this trip.',
    })
    async createRating(
        @Body() createRatingDto: CreateRatingDto, 
        @Session() session: ISession,
        @Param('tripId') tripId: number
    ) {
        const rating: Rating = new Rating();
        const trip: Offer = await this.offerService.getOffer(tripId);
        const rater = await this.userService.getUserById(session.userData.id);
        const ratee = await this.userService.getUserById(createRatingDto.rateeId);
        let isRaterDriver: boolean;

        if(trip.clients.some(client => client.id == rater.id)) {
            isRaterDriver = false;
            rating.driver = true;
        } else if(trip.provider.id == rater.id) {
            isRaterDriver = true;
            rating.driver = false;
        } else {
            throw new ForbiddenException(false, 'You cannot rate this trip.');
        }

        if(!trip.clients.some(client => client.id == ratee.id) && trip.provider.id != ratee.id) {
            throw new ForbiddenException(false, 'You cannot rate this user.');
        }

        if(rater.id == ratee.id) {
            throw new ForbiddenException(false, 'You cannot rate yourself.');
        }

        if(trip.state != TripState.finished) {
            throw new ForbiddenException(false, 'You cannot rate a trip that is not finished.');
        }

        if(!isRaterDriver && ratee.id != trip.provider.id) {
            throw new ForbiddenException(false, 'You cannot rate other passengers.');
        }

        if(await this.ratingService.isAlreadyRated(rater.id, ratee.id)){
            throw new ForbiddenException(false, 'You already rated the user for this trip.');       
        }

        rating.rater = rater;
        rating.rated = ratee;
        rating.trip = trip;
        rating.punctuality = createRatingDto.punctuality;
        rating.reliability = createRatingDto.reliability;

        if(isRaterDriver) {
            if(!createRatingDto.comfortDuringTrip) {
                throw new ForbiddenException(false, 'You have to rate if you would pick this user again.');
            }
            rating.comfortDuringTrip = createRatingDto.comfortDuringTrip;
            rating.totalRating = (
                rating.punctuality + 
                rating.reliability +
                rating.comfortDuringTrip
            ) / 3;
        } else {
            //ToDo: Unterscheiden zwischen Transport und Lieferung
            if(!createRatingDto.cargoArrivedUndamaged || !createRatingDto.passengerPleasantness) {
                throw new ForbiddenException(false, 'You have to rate if the cargo was delivered undamaged and if you enjoyed the trip.');
            }
            rating.cargoArrivedUndamaged = createRatingDto.cargoArrivedUndamaged;
            rating.passengerPleasantness = createRatingDto.passengerPleasantness;
            rating.totalRating = (
                rating.punctuality + 
                rating.reliability +
                rating.cargoArrivedUndamaged + 
                rating.passengerPleasantness) / 4;
        }

        await this.ratingService.createRating(rating);

        //Check if every user rated the trip
        const ratingsForThisTrip = await this.ratingService.selectRatingsForOffer(trip.id);
        if(ratingsForThisTrip.length == 2 * trip.clients.length) {
            await this.ratingService.setRatingsComplete(trip.id);
        }
        return new OKResponseWithMessageDTO(true, 'Rating created successfully.');
    }
}
