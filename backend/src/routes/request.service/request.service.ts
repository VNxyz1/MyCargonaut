import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripRequest } from '../../database/TripRequest';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(TripRequest)
    private readonly tripRequestRepository: Repository<TripRequest>,
  ) {}

  async save(tripRequest: TripRequest) {
    const tR = await this.tripRequestRepository.save(tripRequest);
    if (!tR) {
      throw new InternalServerErrorException(
        'The trip request could not be saved.',
      );
    }
    return tR;
  }

  async getById(id: number) {
    const tR = await this.tripRequestRepository.findOne({
      where: { id },
      relations: ['startPlz', 'endPlz'],
    });
    if (!tR) {
      throw new NotFoundException('The trip request could not be found.');
    }
    return tR;
  }

  async getAll() {
    const tRs = await this.tripRequestRepository.find({
      relations: ['startPlz', 'endPlz'],
    });
    if (!tRs) {
      throw new NotFoundException('The trip requests could not be found.');
    }
    return tRs;
  }

  async deleteById(id: number) {
    const tR = await this.getById(id);
    await this.delete(tR);
  }

  async delete(tripRequest: TripRequest) {
    if (!tripRequest.id) {
      throw new NotFoundException('This trip request does not exist.');
    }
    tripRequest.startPlz = null;
    tripRequest.endPlz = null;
    await this.save(tripRequest);
    await this.tripRequestRepository.remove(tripRequest);
  }
}
