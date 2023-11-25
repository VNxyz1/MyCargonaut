import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/User';
import { Repository } from 'typeorm';
import { LogInRequestDto } from '../auth/DTOs/LoginRequestDTO';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async logIn(logInDto: LogInRequestDto): Promise<User> {
    const password: string = logInDto.password;
    const user = await this.userRepository.findOne({
      where: { eMail: logInDto.eMail, password },
    });
    if (user !== null) {
      return user;
    } else {
      throw new NotFoundException(
        `There is no combination of this username or email and this password.`,
      );
    }
  }
}
