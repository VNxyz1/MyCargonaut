import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/User';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from '../user/DTOs/CreateUserRequestDTO';
import { UpdateUserRequestDto } from '../user/DTOs/UpdateUserRequestDTO';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['offers', 'trips', 'requestedTransits'],
    });
    if (user == null) {
      throw new NotFoundException(`No User with this Id found.`);
    }
    return user;
  }

  async postUser(createUserDto: CreateUserRequestDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async updateLoggedInUser(id: number, updateUserDto: UpdateUserRequestDto) {
    const user = await this.getUserById(id);

    if (updateUserDto.birthday !== undefined) {
      user.birthday = updateUserDto.birthday;
    }
    if (updateUserDto.phoneNumber !== undefined) {
      user.phoneNumber = updateUserDto.phoneNumber;
    }

    if (updateUserDto.firstName !== undefined) {
      user.firstName = updateUserDto.firstName;
    }
    if (updateUserDto.lastName !== undefined) {
      user.lastName = updateUserDto.lastName;
    }

    if (updateUserDto.description !== undefined) {
      user.description = updateUserDto.description;
    }

    return this.userRepository.save(user);
  }

  async deleteLoggedInUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    await this.removeOldImage(user.id);

    user.eMail = null;
    user.password = null;
    user.firstName = '****';
    user.lastName = '****';
    user.birthday = null;
    user.coins = 0;
    user.profilePicture = '';
    user.phoneNumber = null;
    user.entryDate = null;
    user.description = '';

    await this.userRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getCoinBalanceOfUser(id: number) {
    const user = await this.getUserById(id);
    return user.coins;
  }

  async setCoinBalanceOfUser(id: number, coins: number) {
    const user = await this.getUserById(id);
    user.coins = coins;
    await this.userRepository.save(user);
  }

  async increaseCoinBalanceOfUser(id: number, coins: number) {
    const user = await this.getUserById(id);
    user.coins += coins;
    await this.userRepository.save(user);
  }

  async decreaseCoinBalanceOfUser(id: number, coins: number) {
    const user = await this.getUserById(id);
    user.coins -= coins;
    await this.userRepository.save(user);
  }

  async reserveCoinBalanceOfUser(id: number, coins: number) {
    const user = await this.getUserById(id);
    user.coins -= coins;
    user.reservedCoins += coins;
    await this.userRepository.save(user);
  }

  async decreaseReservedCoinBalanceOfUser(id: number, coins: number) {
    const user = await this.getUserById(id);
    user.reservedCoins -= coins;
    await this.userRepository.save(user);
  }

  async removeOldImage(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    if (user.profilePicture.length > 0) {
      const oldImagePath = join(process.cwd(), 'uploads', 'profile-images', user.profilePicture);
      if (existsSync(oldImagePath)) {
        unlinkSync(oldImagePath);
      }
    }
  }

  async saveProfileImagePath(userId: number, imagePath: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    user.profilePicture = imagePath;
    await this.userRepository.save(user);
  }
}
