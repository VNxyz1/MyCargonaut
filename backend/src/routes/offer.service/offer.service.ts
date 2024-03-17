import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOfferDto } from '../offer/DTOs/CreateOfferDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/User';
import { Not, Repository } from 'typeorm';
import { Offer } from '../../database/Offer';
import { Like } from 'typeorm';
import { UpdateOfferRequestDto } from '../offer/DTOs/UpdateOfferRequestDto';
import { TripState } from '../../database/TripState';
import { TransitRequest } from '../../database/TransitRequest';
import { RoutePart } from '../../database/RoutePart';
import { PlzService } from '../plz.service/plz.service';
import { createRoutePart } from '../utils/createRoutePart';
import { Vehicle } from '../../database/Vehicle';
import { ReservedCoin } from '../../database/ReservedCoin';

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
    @InjectRepository(ReservedCoin)
    private readonly reservedCoinRepository: Repository<ReservedCoin>,
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
          { description: Like(`%${searchFor}%`), state: Not(TripState.finished) },
          { route: { plz: { location: Like(`%${searchFor}%`) } }, state: Not(TripState.finished) },
          { route: { plz: { plz: Like(`%${searchFor}%`) } }, state: Not(TripState.finished) },
        ],
        relations: ['provider', 'route.plz', 'clients', 'transitRequests', 'vehicle'],
      });
    }

    return await this.offerRepository.find({
      where: { state: Not(TripState.finished) },
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

  async getOfferThatIsNotFinished(id: number) {
    const offer = await this.offerRepository.findOne({
      where: {
        id: id,
        state: Not(TripState.finished),
      },
      relations: ['provider', 'route.plz', 'clients', 'transitRequests', 'vehicle'],
    });
    if (!offer) {
      throw new BadRequestException('Offer was not found. It may already be finished.');
    }

    return offer;
  }

  async getOfferThatIsInTransit(id: number) {
    const offer = await this.offerRepository.findOne({
      where: {
        id: id,
        state: TripState.inTransit,
      },
      relations: ['provider', 'route.plz', 'clients', 'transitRequests', 'vehicle'],
    });
    if (!offer) {
      throw new BadRequestException('The Offer you are trying to find is not in transit yet.');
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

  async getReservedCoinsForClient(client: User, offer: Offer) {
    const result = await this.reservedCoinRepository
      .createQueryBuilder('reservedCoin')
      .select('reservedCoin.amount')
      .where('reservedCoin.user = :userId', { userId: client.id })
      .andWhere('reservedCoin.trip = :tripId', { tripId: offer.id })
      .getOne();

    return result ? result.amount : null;
  }
}
