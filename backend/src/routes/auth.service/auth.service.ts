import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/User';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserByEMail(eMail: string) {
    const user = await this.userRepository.findOne({
      where: { eMail: eMail },
    });

    if (!user) {
      throw new NotFoundException(`There is no user with this email.`);
    }

    return user;
  }
}
