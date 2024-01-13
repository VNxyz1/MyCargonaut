import { Injectable } from '@nestjs/common';
import { Rating } from '../../database/Rating';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { GetAverageRatingsDto } from '../rating/DTOs/GetAverageRatingsResponseDTO';
import { GetUserRatingsDto } from '../rating/DTOs/GetUserRatingsResponseDTO';
import { GetRatingDto } from '../rating/DTOs/GetRatingResponseDTO';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async selectRatingsForRatedTrip(tripId: number) {
    return await this.ratingRepository.find({
      where: { trip: Equal(tripId), complete: true },
    });
  }

  async createRating(rating: Rating) {
    return await this.ratingRepository.save(rating);
  }

  async isAlreadyRated(raterId: number, rateeId: number) {
    const rated = await this.ratingRepository.findOne({
      where: { rater: Equal(raterId), rated: Equal(rateeId) },
    });
    return rated ? true : false;
  }

  async selectRatingsForOffer(tripId: number) {
    return await this.ratingRepository.find({ where: { trip: Equal(tripId) } });
  }

  async setRatingsComplete(tripId: number) {
    const ratings = await this.ratingRepository.find({
      where: { trip: Equal(tripId) },
    });
    ratings.forEach((rating) => {
      rating.complete = true;
    });
    await this.ratingRepository.save(ratings);
  }

  async selectAverageRatingForUser(
    userId: number,
  ): Promise<GetAverageRatingsDto> {
    const ratings = await this.ratingRepository.find({
      where: { rated: Equal(userId), complete: true },
    });
    const averageRatings: GetAverageRatingsDto = new GetAverageRatingsDto();
    let total = 0;
    let punctuality = 0;
    let reliability = 0;
    let passengerPleasantness = 0;
    let comfortDuringTrip = 0;
    let cargoArrivedUndamaged = 0;
    let passengerPleasantnessAmount = 0;
    let comfortDuringTripAmount = 0;
    let cargoArrivedUndamagedAmount = 0;
    ratings.forEach((rating) => {
      total += rating.totalRating;
      punctuality += rating.punctuality;
      reliability += rating.reliability;

      if (rating.passengerPleasantness > 0) {
        passengerPleasantness += rating.passengerPleasantness;
        passengerPleasantnessAmount++;
      }

      if (rating.comfortDuringTrip > 0) {
        comfortDuringTrip += rating.comfortDuringTrip;
        comfortDuringTripAmount++;
      }

      if (rating.cargoArrivedUndamaged > 0) {
        cargoArrivedUndamaged += rating.cargoArrivedUndamaged;
        cargoArrivedUndamagedAmount++;
      }
    });

    averageRatings.amount = ratings.length;
    averageRatings.total = total / ratings.length;
    averageRatings.punctuality = punctuality / ratings.length;
    averageRatings.reliability = reliability / ratings.length;
    averageRatings.passengerPleasantness =
      passengerPleasantness / passengerPleasantnessAmount;
    averageRatings.comfortDuringTrip =
      comfortDuringTrip / comfortDuringTripAmount;
    averageRatings.cargoArrivedUndamaged =
      cargoArrivedUndamaged / cargoArrivedUndamagedAmount;

    if (!averageRatings.total) {
      averageRatings.total = 0;
    }

    if (!averageRatings.reliability) {
      averageRatings.reliability = 0;
    }

    if (!averageRatings.punctuality) {
      averageRatings.punctuality = 0;
    }

    if (!averageRatings.passengerPleasantness) {
      averageRatings.passengerPleasantness = 0;
    }

    if (!averageRatings.comfortDuringTrip) {
      averageRatings.comfortDuringTrip = 0;
    }

    if (!averageRatings.cargoArrivedUndamaged) {
      averageRatings.cargoArrivedUndamaged = 0;
    }

    return averageRatings;
  }

  async selectAllRatingsByUserId(userId: number, driverRating: boolean) {
    return await this.ratingRepository.find({where: {rated: Equal(userId), driver: driverRating, complete: true}});
  }
}
