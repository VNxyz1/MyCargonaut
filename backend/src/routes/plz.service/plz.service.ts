import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Plz } from '../../database/Plz';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlzService {
  constructor(
    @InjectRepository(Plz)
    private readonly plzRepo: Repository<Plz>,
  ) {}

  async createPlz(plz: string, location: string) {
    const checkPlz = await this.checkIfPlzIsDuplicate(plz, location);

    if (!checkPlz) {
      const newPlz = new Plz();
      newPlz.plz = plz;
      newPlz.location = location;
      return await this.plzRepo.save(newPlz);
    }
    return checkPlz;
  }

  async checkIfPlzIsDuplicate(
    plz: string,
    location: string,
  ): Promise<Plz | null> {
    return await this.plzRepo.findOne({
      where: { plz, location },
      relations: ['routeParts'],
    });
  }
}
