import {
  Controller,
  Get,
  Post,
  Body,
  Session,
  UseGuards,
  Param,
  ForbiddenException,
} from '@nestjs/common';
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
import { GetRatingsForTripResponseDTO } from './DTOs/GetRatingsForTripResponseDTO';
import { GetRatingStatusDto } from './DTOs/GetRatingStatusResponseDTO';
import { GetAllRatingStatusDto } from './DTOs/GetAllRatingStatusResponseDTO';
import { GetUserRatingsDto } from './DTOs/GetUserRatingsResponseDTO';

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
  @ApiResponse({ type: GetRatingsForTripResponseDTO })
  @ApiResponse({
    status: 403,
    type: ForbiddenException,
    description: 'The trip is not finished yet.',
  })
  async getRatingsForTrip(@Param('tripId') tripId: number) {
    const trip = await this.offerService.getOffer(tripId);
    const ratings = await this.ratingService.selectRatingsForRatedTrip(tripId);

    if (trip.state != TripState.finished) {
      throw new ForbiddenException(false, 'The trip is not finished yet.');
    }

    if (ratings.length == 0) {
      throw new ForbiddenException(
        false,
        'Not all users have rated this trip yet.',
      );
    }

    const response: GetRatingsForTripResponseDTO =
      new GetRatingsForTripResponseDTO();
    response.passengerRatings = [];
    response.driverRatings = [];
    ratings.forEach((rating) => {
      const ratingDto: GetRatingDto = new GetRatingDto();
      ratingDto.rateeId = rating.rated.id;
      ratingDto.raterId = rating.rater.id;
      ratingDto.tripId = rating.trip.id;
      ratingDto.tripDate = rating.trip.startDate.toISOString();
      ratingDto.totalRating = rating.totalRating;
      ratingDto.punctuality = rating.punctuality;
      ratingDto.reliability = rating.reliability;
      ratingDto.comfortDuringTrip = rating.comfortDuringTrip;
      ratingDto.cargoArrivedUndamaged = rating.cargoArrivedUndamaged;
      ratingDto.passengerPleasantness = rating.passengerPleasantness;

      if (rating.driver) {
        response.driverRatings.push(ratingDto);
      } else {
        response.passengerRatings.push(ratingDto);
      }
    });
    return response;
  }

  @UseGuards(IsLoggedInGuard)
  @Get(':tripId/own')
  @ApiOperation({
    summary: 'Gets status of own ratings for a trip',
    description: `Allows a logged-in user to get the status of the own ratings for a completed trip.`,
  })
  @ApiResponse({ type: GetAllRatingStatusDto })
  @ApiResponse({
    status: 403,
    type: ForbiddenException,
    description: 'The trip is not finished yet.',
  })
  async getRatingStatusForTrip(
    @Session() session: ISession,
    @Param('tripId') tripId: number,
  ) {
    const trip: Offer = await this.offerService.getOffer(tripId);
    const rater = await this.userService.getUserById(session.userData.id);
    let isRaterDriver: boolean;

    if (trip.clients.some((client) => client.id == rater.id)) {
      isRaterDriver = false;
    } else if (trip.provider.id == rater.id) {
      isRaterDriver = true;
    } else {
      throw new ForbiddenException(false, 'You were not part of this trip.');
    }

    if (trip.state != TripState.finished) {
      throw new ForbiddenException(false, 'The trip is not finished yet.');
    }

    const response: GetAllRatingStatusDto = new GetAllRatingStatusDto();
    response.ratees = [];

    if (isRaterDriver) {
      const clientIds: number[] = [];
      trip.clients.forEach((client) => clientIds.push(client.id));
      for (const clientId of clientIds) {
        const rated: boolean = await this.ratingService.isAlreadyRated(
          rater.id,
          clientId,
        );
        const status: GetRatingStatusDto = new GetRatingStatusDto();
        status.rateeId = clientId;
        status.rated = rated;
        response.ratees.push(status);
      }
    } else {
      const rated: boolean = await this.ratingService.isAlreadyRated(
        rater.id,
        trip.provider.id,
      );
      const status: GetRatingStatusDto = new GetRatingStatusDto();
      status.rateeId = trip.provider.id;
      status.rated = rated;
      response.ratees.push(status);
    }

    return response;
  }

  @UseGuards(IsLoggedInGuard)
    @Get('/user/:userId')
    @ApiOperation({
        summary: 'Gets all ratings from an user',
        description: `Allows a logged-in user to get all ratings from an user.`,
    })
    @ApiResponse({ type: GetUserRatingsDto })
    @ApiResponse({
        status: 403,
        type: ForbiddenException,
        description: 'Forbidden resource.',
    })
    async getUserRatings(@Param('userId') userId: number) {
        const user = await this.userService.getUserById(userId);
        const ratingsAsDriver = await this.ratingService.selectAllRatingsByUserId(user.id, true);
        const ratingsAsPassenger = await this.ratingService.selectAllRatingsByUserId(user.id, false);

        const ratings: GetUserRatingsDto = new GetUserRatingsDto();
        ratings.ratingsAsDriver = [];
        ratings.ratingsAsPassenger = [];

        ratingsAsDriver.forEach(rating => {
            const driverRating: GetRatingDto = new GetRatingDto();
            driverRating.rateeId = rating.rated.id;
            driverRating.raterId = rating.rater.id;
            driverRating.tripId = rating.trip.id;
            driverRating.tripDate = rating.trip.startDate.toISOString();
            driverRating.totalRating = rating.totalRating ? rating.totalRating : 0;
            driverRating.punctuality = rating.punctuality ? rating.punctuality : 0;
            driverRating.reliability = rating.reliability ? rating.reliability : 0;
            driverRating.cargoArrivedUndamaged = rating.cargoArrivedUndamaged ? rating.cargoArrivedUndamaged : 0;
            driverRating.passengerPleasantness = rating.passengerPleasantness ? rating.passengerPleasantness : 0;

            ratings.ratingsAsDriver.push(driverRating);
        });

        ratingsAsPassenger.forEach(rating => {
            const passengerRating: GetRatingDto = new GetRatingDto();
            passengerRating.rateeId = rating.rated.id;
            passengerRating.raterId = rating.rater.id;
            passengerRating.tripId = rating.trip.id;
            passengerRating.tripDate = rating.trip.startDate.toISOString();
            passengerRating.totalRating = rating.totalRating ? rating.totalRating : 0;
            passengerRating.punctuality = rating.punctuality ? rating.punctuality : 0;
            passengerRating.reliability = rating.reliability ? rating.reliability : 0;
            passengerRating.comfortDuringTrip = rating.comfortDuringTrip ? rating.comfortDuringTrip : 0;

            ratings.ratingsAsPassenger.push(passengerRating);
        });
        return ratings;
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
    @Param('tripId') tripId: number,
  ) {
    const rating: Rating = new Rating();
    const trip: Offer = await this.offerService.getOffer(tripId);
    const rater = await this.userService.getUserById(session.userData.id);
    const ratee = await this.userService.getUserById(createRatingDto.rateeId);
    let isRaterDriver: boolean;

    if (trip.clients.some((client) => client.id == rater.id)) {
      isRaterDriver = false;
      rating.driver = true;
    } else if (trip.provider.id == rater.id) {
      isRaterDriver = true;
      rating.driver = false;
    } else {
      throw new ForbiddenException(false, 'You cannot rate this trip.');
    }

    if (
      !trip.clients.some((client) => client.id == ratee.id) &&
      trip.provider.id != ratee.id
    ) {
      throw new ForbiddenException(false, 'You cannot rate this user.');
    }

    if (rater.id == ratee.id) {
      throw new ForbiddenException(false, 'You cannot rate yourself.');
    }

    if (trip.state != TripState.finished) {
      throw new ForbiddenException(
        false,
        'You cannot rate a trip that is not finished.',
      );
    }

    if (!isRaterDriver && ratee.id != trip.provider.id) {
      throw new ForbiddenException(false, 'You cannot rate other passengers.');
    }

    if (await this.ratingService.isAlreadyRated(rater.id, ratee.id)) {
      throw new ForbiddenException(
        false,
        'You already rated the user for this trip.',
      );
    }

    rating.rater = rater;
    rating.rated = ratee;
    rating.trip = trip;
    rating.punctuality = createRatingDto.punctuality;
    rating.reliability = createRatingDto.reliability;

    if (isRaterDriver) {
      if (!createRatingDto.comfortDuringTrip) {
        throw new ForbiddenException(
          false,
          'You have to rate if you would pick this user again.',
        );
      }
      rating.comfortDuringTrip = createRatingDto.comfortDuringTrip;
      rating.cargoArrivedUndamaged = 0;
      rating.passengerPleasantness = 0;
      rating.totalRating =
        (rating.punctuality + rating.reliability + rating.comfortDuringTrip) /
        3;
    } else {
      if (
        !createRatingDto.cargoArrivedUndamaged &&
        !createRatingDto.passengerPleasantness
      ) {
        throw new ForbiddenException(
          false,
          'You have to rate if the cargo was delivered undamaged or if you enjoyed the trip.',
        );
      }

      if (
        createRatingDto.cargoArrivedUndamaged &&
        createRatingDto.passengerPleasantness
      ) {
        rating.comfortDuringTrip = 0;
        rating.cargoArrivedUndamaged = createRatingDto.cargoArrivedUndamaged;
        rating.passengerPleasantness = createRatingDto.passengerPleasantness;
        rating.totalRating =
          (rating.punctuality +
            rating.reliability +
            rating.cargoArrivedUndamaged +
            rating.passengerPleasantness) /
          4;
      } else if (createRatingDto.cargoArrivedUndamaged) {
        rating.comfortDuringTrip = 0;
        rating.cargoArrivedUndamaged = createRatingDto.cargoArrivedUndamaged;
        rating.passengerPleasantness = 0;
        rating.totalRating =
          (rating.punctuality +
            rating.reliability +
            rating.cargoArrivedUndamaged) /
          3;
      } else {
        rating.comfortDuringTrip = 0;
        rating.cargoArrivedUndamaged = 0;
        rating.passengerPleasantness = createRatingDto.passengerPleasantness;
        rating.totalRating =
          (rating.punctuality +
            rating.reliability +
            rating.passengerPleasantness) /
          3;
      }
    }

    await this.ratingService.createRating(rating);

    //Check if every user rated the trip
    const ratingsForThisTrip = await this.ratingService.selectRatingsForOffer(
      trip.id,
    );
    if (ratingsForThisTrip.length == 2 * trip.clients.length) {
      await this.ratingService.setRatingsComplete(trip.id);
    }
    return new OKResponseWithMessageDTO(true, 'Rating created successfully.');
  }
}
