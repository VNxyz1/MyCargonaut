import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOfferDto } from '../offer/DTOs/CreateOfferDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/User';
import { Repository } from 'typeorm';
import { Offer } from '../../database/Offer';
import { Plz } from '../../database/Plz';
import { Like } from 'typeorm';
import { UpdateOfferRequestDto } from '../offer/DTOs/UpdateOfferRequestDto';
import { TripState } from '../../database/TripState';
import { TransitRequest } from '../../database/TransitRequest';
import { RoutePart } from '../../database/RoutePart';

@Injectable()
export class OfferService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      @InjectRepository(Offer)
      private readonly offerRepository: Repository<Offer>,
      @InjectRepository(Plz)
      private readonly plzRepository: Repository<Plz>,
      @InjectRepository(TransitRequest)
      private readonly transitRequestRepository: Repository<TransitRequest>,
      @InjectRepository(RoutePart)
      private readonly routePartRepository: Repository<RoutePart>,
  ) {}

  async postOffer(providerId: number, offerDto: CreateOfferDto) {
    const offer = new Offer();
    offer.vehicle = offerDto.vehicle;
    offer.bookedSeats = offerDto.bookedSeats;
    offer.description = offerDto.description;
    offer.startDate = new Date(offerDto.startDate);

    // @ts-expect-error needs to stay for unit testing purpose
    if (offerDto.createdAt) {
      // @ts-expect-error needs to stay for unit testing purpose
      offer.createdAt = offerDto.createdAt;
    }

    offer.provider = await this.userRepository.findOne({
      where: { id: providerId },
    });

    offer.state = TripState.offer;

    const offerDb = await this.offerRepository.save(offer);

    for (const routePartDto of offerDto.route) {
      const plz = await this.createPlz(routePartDto.plz, routePartDto.location);
      await this.createRoutePart(offerDb, plz, routePartDto.position);
    }

    return offerDb;
  }

  async checkIfPlzIsDuplicate(plz: string, location: string): Promise<Plz | null> {
    return await this.plzRepository.findOne({
      where: { plz, location },
      relations: ['routeParts'],
    });
  }

  async getOffers(searchFor?: string) {
    if (searchFor) {
      return await this.offerRepository.find({
        where: { description: Like(`%${searchFor}%`) },
        relations: ['provider', 'route.plz', 'clients', 'transitRequests'],
      });
    }

    return await this.offerRepository.find({
      relations: ['provider', 'route.plz', 'clients', 'transitRequests'],
    });
  }

  async getOffersOfUser(userId: number) {
    return await this.offerRepository.find({
      where: { provider: { id: userId } },
      relations: ['provider', 'route.plz', 'clients', 'transitRequests'],
    });
  }

  async getOffer(id: number) {
    const offer = await this.offerRepository.findOne({
      where: { id: id },
      relations: ['provider', 'route.plz', 'clients', 'transitRequests'],
    });
    if (!offer) {
      throw new InternalServerErrorException('Offer was not found!');
    }

    return offer;
  }

  private async createPlz(plz: string, location: string) {
    const checkPlz = await this.checkIfPlzIsDuplicate(plz, location);

    if (!checkPlz) {
      const newPlz = new Plz();
      newPlz.plz = plz;
      newPlz.location = location;
      return await this.plzRepository.save(newPlz);
    }
    return checkPlz;
  }

  async updateOffer(updateData: UpdateOfferRequestDto, offer: Offer) {
    if (updateData.description) {
      offer.description = updateData.description;
    }

    if (updateData.startDate) {
      offer.startDate = updateData.startDate;
    }
    await this.offerRepository.save(offer);

    if (updateData.route) {
      const routeArr = await this.routePartRepository.find({
        where: { offer: { id: offer.id } },
        relations: ['offer', 'plz'],
      });
      for (const routePart of routeArr) {
        await this.routePartRepository.delete(routePart.id);
      }

      for (const createRoutePartDto of updateData.route) {
        const plz = await this.createPlz(createRoutePartDto.plz, createRoutePartDto.location);
        await this.createRoutePart(offer, plz, createRoutePartDto.position);
      }
    }

    return this.getOffer(offer.id);
  }

  async deleteOffer(offer: Offer) {
    for (const tR of offer.transitRequests) {
      await this.transitRequestRepository.remove(tR);
    }

    const routeArr = await this.routePartRepository.find({
      where: { offer: { id: offer.id } },
      relations: ['offer', 'plz'],
    });
    for (const routePart of routeArr) {
      await this.routePartRepository.delete(routePart.id);
    }

    await this.offerRepository.remove(offer);
  }

  private async createRoutePart(offer: Offer, plz: Plz, position: number) {
    const routePart = new RoutePart();
    routePart.plz = plz;
    routePart.position = position;
    routePart.offer = offer;
    return await this.routePartRepository.save(routePart);
  }
}