import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../database/User';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

class UserRepositoryMock {
  findOne() {} // You may want to provide a mock implementation if needed
}

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: UserRepositoryMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should get user by id', async () => {
    const user = new User(); // Create a user instance for testing
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    const result = await userService.getUserById(1);

    expect(result).toBe(user);
  });

  it('should throw NotFoundException when user is not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(userService.getUserById(1)).rejects.toThrowError(
      NotFoundException,
    );
  });
});
