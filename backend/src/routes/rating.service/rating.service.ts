import { Injectable } from '@nestjs/common';
import { Rating } from '../../database/Rating';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(Rating)
        private readonly ratingRepository: Repository<Rating>,
        ) {}

    async createRating(rating: Rating) {
        return await this.ratingRepository.save(rating);
    }

    async isAlreadyRated(raterId: number, rateeId: number) {
        const rated = await this.ratingRepository.findOne({where: {rater: Equal(raterId), rated: Equal(rateeId)}});
        return rated ? true : false;
    }

    async selectRatingsForOffer(tripId: number) {
        return await this.ratingRepository.find({where: {trip: Equal(tripId)}});
    }

    async setRatingsComplete(tripId: number) {
        const ratings = await this.ratingRepository.find({where: {trip: Equal(tripId)}});
        ratings.forEach(rating => {
            rating.complete = true;
        });
        await this.ratingRepository.save(ratings);
    }
}
