import { Test, TestingModule } from '@nestjs/testing';
import { RequestController } from './request.controller';
import { RequestService } from '../request.service/request.service';
import { UserController } from '../user/user.controller';
import { UserService } from '../user.service/user.service';
import { PlzService } from '../plz.service/plz.service';
import { User } from '../../database/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '../../database/Offer';
import { Plz } from '../../database/Plz';
import { TransitRequest } from '../../database/TransitRequest';
import { RoutePart } from '../../database/RoutePart';
import { TripRequest } from '../../database/TripRequest';
import { MockCreateUser } from '../user/Mocks/MockCreateUser';
import * as fs from 'fs';

describe('RequestController', () => {
  let requestController: RequestController;
  let userController: UserController;
  let userService: UserService;
  let userForThisTest: User;
  let secondUserForThisTest: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './db/tmp.tester.request.controller.sqlite',
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
      controllers: [UserController, RequestController],
      providers: [UserService, PlzService, RequestService],
    }).compile();

    userService = module.get<UserService>(UserService);
    requestController = module.get<RequestController>(RequestController);
    userController = module.get<UserController>(UserController);

    // create users for testing
    await userController.postUser(new MockCreateUser(false, 0));
    userForThisTest = await userService.getUserById(1);

    await userController.postUser(new MockCreateUser(false, 1));
    secondUserForThisTest = await userService.getUserById(2);
  });

  it('should be defined', () => {
    expect(requestController).toBeDefined();
  });

  afterAll(async () => {
    fs.unlink('./db/tmp.tester.request.controller.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });
});
