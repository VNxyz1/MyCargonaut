import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOfferDto } from '../offer/DTOs/CreateOfferDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/User';
import { Repository } from 'typeorm';
import { Offer } from '../../database/Offer';
import { Like } from 'typeorm';
import { UpdateOfferRequestDto } from '../offer/DTOs/UpdateOfferRequestDto';
import { TripState } from '../../database/TripState';
import { TransitRequest } from '../../database/TransitRequest';
import { RoutePart } from '../../database/RoutePart';
import { PlzService } from '../plz.service/plz.service';
import { createRoutePart } from '../utils/createRoutePart';
import { Vehicle } from '../../database/Vehicle';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(TransitRequest)
    private readonly transitRequestRepository: Repository<TransitRequest>,
    @InjectRepository(RoutePart)
    private readonly routePartRepository: Repository<RoutePart>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly plzService: PlzService,
  ) {}

  async saveRoutePart(routePart: RoutePart) {
    const rP = await this.routePartRepository.save(routePart);
    if (!rP) {
      throw new InternalServerErrorException('routePart could not be saved.');
    }
    return rP;
  }

  async postOffer(providerId: number, offerDto: CreateOfferDto) {
    const offer = new Offer();
    offer.vehicle = await this.vehicleRepository.findOne({
      where: { id: offerDto.vehicleId },
    });
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
      const plz = await this.plzService.createPlz(routePartDto.plz, routePartDto.location);
      const rP = await createRoutePart(offerDb, plz, routePartDto.position);
      await this.saveRoutePart(rP);
    }

    return offerDb;
  }

  async getOffers(searchFor?: string) {
    if (searchFor) {
      return await this.offerRepository.find({
        where: [
          { description: Like(`%${searchFor}%`) },
          { route: { plz: { location: Like(`%${searchFor}%`) } } },
          { route: { plz: { plz: Like(`%${searchFor}%`) } } },
        ],
        relations: ['provider', 'route.plz', 'clients', 'transitRequests', 'vehicle'],
      });
    }

    return await this.offerRepository.find({
      relations: ['provider', 'route.plz', 'clients', 'transitRequests', 'vehicle'],
    });
  }

  async getOffersOfUser(userId: number) {
    return await this.offerRepository.find({
      where: { provider: { id: userId } },
      relations: ['provider', 'route.plz', 'clients', 'transitRequests', 'vehicle'],
    });
  }

  async getOffersOfUserAsPassenger(userId: number) {
    return await this.offerRepository.find({
      where: { clients: { id: userId } },
      relations: ['provider', 'route.plz', 'clients', 'transitRequests', 'vehicle'],
    });
  }

  async getOffer(id: number) {
    const offer = await this.offerRepository.findOne({
      where: { id: id },
      relations: ['provider', 'route.plz', 'clients', 'transitRequests', 'vehicle'],
    });
    if (!offer) {
      throw new InternalServerErrorException('Offer was not found!');
    }

    return offer;
  }

  async updateOffer(updateData: UpdateOfferRequestDto, offer: Offer) {
    if (updateData.description !== undefined) {
      offer.description = updateData.description;
    }

    if (updateData.startDate !== undefined) {
      offer.startDate = updateData.startDate;
    }

    await this.offerRepository.save(offer);

    if (updateData.route !== undefined) {
      const routeArr = await this.routePartRepository.find({
        where: { offer: { id: offer.id } },
        relations: ['offer', 'plz'],
      });
      for (const routePart of routeArr) {
        await this.routePartRepository.delete(routePart.id);
      }

      for (const createRoutePartDto of updateData.route) {
        const plz = await this.plzService.createPlz(createRoutePartDto.plz, createRoutePartDto.location);
        const rP = await createRoutePart(offer, plz, createRoutePartDto.position);
        await this.routePartRepository.save(rP);
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

  async saveOffer(offer: Offer) {
    const updatedOffer = await this.offerRepository.save(offer);
    if (!updatedOffer) {
      throw new InternalServerErrorException('The offer could not be saved.');
    }
    return updatedOffer;
  }
}
