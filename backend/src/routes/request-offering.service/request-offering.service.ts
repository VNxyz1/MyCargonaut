import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TripRequest } from '../../database/TripRequest';
import { Repository } from 'typeorm';
import { TripRequestOffering } from '../../database/TripRequestOffering';

@Injectable()
export class RequestOfferingService {
  constructor(
    @InjectRepository(TripRequest)
    private readonly tripRequestRepository: Repository<TripRequest>,
    @InjectRepository(TripRequestOffering)
    private readonly offeringRepository: Repository<TripRequestOffering>,
  ) {}

  async getAllPendingOfRequestingUser(id: number) {
    const offerings = await this.offeringRepository.find({
      where: { tripRequest: { requester: { id } } },
      relations: ['offeringUser', 'tripRequest', 'tripRequest.requester'],
    });
    if (!offerings) {
      throw new NotFoundException('The offerings could not be found.');
    }
    return offerings;
  }

  async getAllPendingOfOfferingUser(id: number) {
    const offerings = await this.offeringRepository.find({
      where: { offeringUser: { id } },
      relations: ['offeringUser', 'tripRequest', 'tripRequest.requester'],
    });
    if (!offerings) {
      throw new NotFoundException('The offerings could not be found.');
    }
    return offerings;
  }

  async getById(id: number) {
    const offering = await this.offeringRepository.findOne({
      where: { id },
      relations: ['offeringUser', 'tripRequest'],
    });
    if (!offering) {
      throw new NotFoundException('The offering could not be found.');
    }
    return offering;
  }

  async getAllOfTripRequest(tripRequestId: number) {
    const offerings = await this.offeringRepository.find({
      where: { tripRequest: { id: tripRequestId } },
      relations: ['offeringUser', 'tripRequest'],
    });
    if (!offerings) {
      throw new NotFoundException('The offerings could not be found.');
    }
    return offerings;
  }

  async save(offering: TripRequestOffering) {
    const offeringDb = await this.offeringRepository.save(offering);
    if (!offeringDb) {
      throw new InternalServerErrorException('The offering could not be saved.');
    }
    return offeringDb;
  }

  async deleteById(id: number) {
    const offering = await this.getById(id);
    await this.delete(offering);
  }

  async delete(offering: TripRequestOffering) {
    if (!offering.id) {
      throw new NotFoundException('This offer does not exist.');
    }
    offering.tripRequest = null;
    offering.offeringUser = null;
    await this.save(offering);
    await this.offeringRepository.remove(offering);
  }
}
