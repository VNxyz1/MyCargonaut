import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/User';
import { Repository } from 'typeorm';
import {CreateUserRequestDto} from "../user/DTOs/CreateUserRequestDTO";
import {UpdateUserRequestDto} from "../user/DTOs/UpdateUserRequestDTO";

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
    await this.duplicateUsername(createUserDto.username);
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  private async duplicateUsername(username) {
    const duplicate = await this.userRepository.findOne({where: {username}});
    if(duplicate) {
      throw new InternalServerErrorException("Username is already taken")
    }

  }

  async updateLoggedInUser(id: number, updateUserDto: UpdateUserRequestDto) {


    const user = await this.userRepository.findOne({ where: { id } });

    if (updateUserDto.username) {
      await this.duplicateUsername(updateUserDto.username);
      user.username = updateUserDto.username;
    }
    if (updateUserDto.eMail) {
      user.eMail = updateUserDto.eMail;
    }
    if (updateUserDto.firstName) {
      user.firstName = updateUserDto.firstName;
    }
    if (updateUserDto.lastName) {
      user.lastName = updateUserDto.lastName;
    }
    if (updateUserDto.profilePicture) {
      user.profilePicture = updateUserDto.profilePicture;
    }
    if (updateUserDto.password) {
      user.password = updateUserDto.password;
    }

    return this.userRepository.save(user);
  }

  async deleteLoggedInUser(id: number) {
      const user = await this.userRepository.findOne({ where: { id } });

      user.username = `Gelöschter Benutzer${user.id}`;
      user.firstName = "****";
      user.lastName = "****";
      user.eMail = null;
      user.profilePicture = "";
      user.password = null;

      await this.userRepository.save(user);
  }


}
