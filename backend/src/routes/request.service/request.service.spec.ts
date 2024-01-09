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
import { MockCreateTripRequest } from './Mock/MockCreateTripRequest';
import { PlzService } from '../plz.service/plz.service';
import { CreatePlzDto } from '../offer/DTOs/CreatePlzDto';
import { NotFoundException } from '@nestjs/common';

describe('RequestService', () => {
  let requestService: RequestService;
  let userController: UserController;
  let userService: UserService;
  let plzService: PlzService;
  let userForThisTest: User;
  let secondUserForThisTest: User;
  let tripRequestArr: TripRequest[] = [];

  beforeAll(async () => {
    await setUp();
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
      const getTR = await requestService.getById(1);
      getTR.requester.trips = [];
      getTR.requester.requestedTransits = [];
      getTR.requester.offers = [];
      expect(getTR).toEqual(tripRequestArr[0]);
    });
  });

  describe('getById function', () => {
    it('should retrieve a specific trip request by ID', async () => {
      const retrievedTripRequest = await requestService.getById(1);
      retrievedTripRequest.requester.trips = [];
      retrievedTripRequest.requester.requestedTransits = [];
      retrievedTripRequest.requester.offers = [];
      expect(retrievedTripRequest).toEqual(tripRequestArr[0]);
    });

    it('should throw NotFoundException for non-existing trip request', async () => {
      await expect(requestService.getById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAll function', () => {
    it('should retrieve all trip requests', async () => {
      await postTripRequest(
        userForThisTest,
        { plz: '63679', location: 'Schotten' },
        { plz: '35390', location: 'Gießen' },
        2,
      );
      const allTripRequests = await requestService.getAll();

      expect(allTripRequests.length).toEqual(2);
    });

    it('should an empty array', async () => {
      await deleteDb();
      await setUp();

      await expect(requestService.getAll()).resolves.toEqual([]);
    });
  });

  describe('deleteById function', () => {
    it('should delete a specific trip request by ID', async () => {
      const savedTripRequest = await postTripRequest(
        userForThisTest,
        { plz: '12345', location: 'City1' },
        { plz: '67890', location: 'City2' },
        3,
      );

      await requestService.deleteById(1);

      await expect(requestService.getById(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for non-existing trip request', async () => {
      await expect(requestService.deleteById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete function', () => {
    it('should delete a specific trip request', async () => {
      const savedTripRequest = await postTripRequest(
        userForThisTest,
        { plz: '12345', location: 'City1' },
        { plz: '67890', location: 'City2' },
        3,
      );

      await requestService.delete(savedTripRequest);

      await expect(requestService.getById(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for non-existing trip request', async () => {
      const createdStartPlz = await plzService.createPlz('63679', 'Schotten');
      const createdEndPlz = await plzService.createPlz('35390', 'Schotten');
      const nonExistingTripRequest = new MockCreateTripRequest(
        userForThisTest,
        createdStartPlz,
        createdEndPlz,
        4,
      );

      await expect(
        requestService.delete(nonExistingTripRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

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

    const tRdB = await requestService.save(tR);
    tripRequestArr.push(tRdB);
    return tRdB;
  };

  afterAll(async () => {
    await deleteDb();
  });

  const setUp = async () => {
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
  };

  const deleteDb = async () => {
    tripRequestArr = [];
    fs.unlink('./db/tmp.tester.request.service.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  };
});
