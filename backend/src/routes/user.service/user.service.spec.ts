import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../database/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MockCreateUser } from '../user/Mocks/MockCreateUser';
import { Offer } from '../../database/Offer';
import { Plz } from '../../database/Plz';
import { TransitRequest } from '../../database/TransitRequest';
import { MockGetUser } from '../user/Mocks/MockGetUser';
import * as fs from 'fs';
import { UpdateUserRequestDto } from '../user/DTOs/UpdateUserRequestDTO';
import { RoutePart } from '../../database/RoutePart';
import { TripRequest } from '../../database/TripRequest';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './db/tmp.tester.user.service.sqlite',
          entities: [User, Offer, Plz, TransitRequest, RoutePart, TripRequest],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([
          User,
          Offer,
          Plz,
          TransitRequest,
          RoutePart,
          TripRequest,
        ]),
      ],
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    fs.unlink('./db/tmp.tester.user.service.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto = new MockCreateUser(true);

    const result = await userService.postUser(createUserDto);
    expect(result).toHaveProperty('id');
  });

  it('should get user by id', async () => {
    const user = new MockGetUser(true, true);
    user.password = '1234';

    const result = await userService.getUserById(1);

    expect(result).toEqual(user);
  });

  it('should throw NotFoundException when user is not found', async () => {
    await expect(userService.getUserById(9999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should retrieve a list of all users', async () => {
    const result = await userService.getAllUsers();
    const resultMock: MockGetUser[] = [];
    const mockUser = new MockGetUser(true);
    mockUser.password = '1234';
    mockUser.requestedTransits = undefined;
    resultMock.push(mockUser);
    expect(result).toEqual(resultMock);
  });

  it('should update user information', async () => {
    const userId = 1;
    const updateUserDto: UpdateUserRequestDto = {
      lastName: 'ska dda',
    };

    const result = await userService.updateLoggedInUser(userId, updateUserDto);
    expect(result).toHaveProperty('id', userId);
  });

  it('should increase coin balance of user', async () => {
    const userId = 1;
    const initialCoins = await userService.getCoinBalanceOfUser(userId);

    const coinsToAdd = 10;
    await userService.increaseCoinBalanceOfUser(userId, coinsToAdd);

    const updatedCoins = await userService.getCoinBalanceOfUser(userId);
    expect(updatedCoins).toBe(initialCoins + coinsToAdd);
  });

  it('should decrease coin balance of user', async () => {
    const userId = 1;
    const initialCoins = await userService.getCoinBalanceOfUser(userId);

    const coinsToSub = 10;
    await userService.decreaseCoinBalanceOfUser(userId, coinsToSub);

    const updatedCoins = await userService.getCoinBalanceOfUser(userId);
    expect(updatedCoins).toBe(initialCoins - coinsToSub);
  });
});
