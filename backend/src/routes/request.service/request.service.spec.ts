import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from './request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/User';
import { Offer } from '../../database/Offer';
import { Plz } from '../../database/Plz';
import { TransitRequest } from '../../database/TransitRequest';
import { RoutePart } from '../../database/RoutePart';
import { UserService } from '../user.service/user.service';
import { MockCreateUser } from '../user/Mocks/MockCreateUser';
import { TripRequest } from '../../database/TripRequest';
import * as fs from 'fs';
import { UserController } from '../user/user.controller';
import { MockCreateTripRequest } from './MockCreateTripRequest';
import { PlzService } from '../plz.service/plz.service';
import { CreatePlzDto } from '../offer/DTOs/CreatePlzDto';

describe('RequestService', () => {
  let requestService: RequestService;
  let userController: UserController;
  let userService: UserService;
  let plzService: PlzService;
  let userForThisTest: User;
  let secondUserForThisTest: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './db/tmp.tester.request.service.sqlite',
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
      controllers: [UserController],
      providers: [UserService, PlzService, RequestService, PlzService],
    }).compile();

    userService = module.get<UserService>(UserService);
    requestService = module.get<RequestService>(RequestService);
    userController = module.get<UserController>(UserController);
    plzService = module.get<PlzService>(PlzService);

    // create users for testing
    await userController.postUser(new MockCreateUser(false, 0));
    userForThisTest = await userService.getUserById(1);

    await userController.postUser(new MockCreateUser(false, 1));
    secondUserForThisTest = await userService.getUserById(2);
  });

  it('should be defined', () => {
    expect(requestService).toBeDefined();
  });

  describe('save function', () => {
    it('should post a trip request to the db', async () => {
      await expect(
        postTripRequest(
          userForThisTest,
          { plz: '63679', location: 'Schotten' },
          { plz: '35390', location: 'Gießen' },
          2,
        ),
      ).resolves.toBeDefined();
      //TODO: implement MockGetTripRequest and new expect cases
    });
  });

  describe('getById function', () => {});

  describe('getAll function', () => {});

  describe('deleteById function', () => {});

  describe('delete function', () => {});

  const postTripRequest = async (
    user: User,
    startPlz: CreatePlzDto,
    endPlz: CreatePlzDto,
    seats: number,
  ) => {
    const createdStartPlz = await plzService.createPlz(
      startPlz.plz,
      startPlz.location,
    );
    const createdEndPlz = await plzService.createPlz(
      endPlz.plz,
      endPlz.location,
    );

    const tR = new MockCreateTripRequest(
      user,
      createdStartPlz,
      createdEndPlz,
      seats,
    );

    return requestService.save(tR);
  };

  afterAll(async () => {
    fs.unlink('./db/tmp.tester.request.service.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });
});
