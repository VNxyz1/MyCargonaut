import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/User';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from '../user/DTOs/CreateUserRequestDTO';
import { UpdateUserRequestDto } from '../user/DTOs/UpdateUserRequestDTO';
import {join} from "path";
import {existsSync, unlinkSync} from "fs";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
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
    const user = await this.userRepository.findOne({ where: { id } });

    if (updateUserDto.birthday) {
      user.birthday = updateUserDto.birthday;
    }
    if (updateUserDto.phoneNumber) {
      user.phoneNumber = updateUserDto.phoneNumber;
    }

    if (updateUserDto.firstName) {
      user.firstName = updateUserDto.firstName;
    }
    if (updateUserDto.lastName) {
      user.lastName = updateUserDto.lastName;
    }
    /*
    if (updateUserDto.profilePicture) {
      user.profilePicture = updateUserDto.profilePicture;
    }*/

    if (updateUserDto.description) {
      user.description = updateUserDto.description;
    }

    return this.userRepository.save(user);
  }

  async deleteLoggedInUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    user.phoneNumber = null;
    user.firstName = '****';
    user.lastName = '****';
    user.eMail = null;
    user.profilePicture = '';
    user.password = null;
    user.birthday = null;

    await this.userRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  
  async removeOldImage(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    const oldImagePath = join(process.cwd(), 'uploads', 'profile-images', user.profilePicture);
    if (existsSync(oldImagePath)) {
      unlinkSync(oldImagePath);
    } else {
      throw new NotFoundException(`No existing image path found.`);
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
