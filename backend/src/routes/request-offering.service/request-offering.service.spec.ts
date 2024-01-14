import { Test, TestingModule } from '@nestjs/testing';
import { RequestOfferingService } from './request-offering.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../database/User';
import { MockCreateUser } from '../user/Mocks/MockCreateUser';
import { MockCreateTripRequestOffering } from './Mocks/MockCreateTripRequestOffering';
import { entityArr, sqlite_setup } from '../../utils/sqlite_setup';
import * as fs from 'fs';
import { CreatePlzDto } from '../offer/DTOs/CreatePlzDto';
import { MockCreateTripRequest } from '../request.service/Mock/MockCreateTripRequest';
import { PlzService } from '../plz.service/plz.service';
import { UserController } from '../user/user.controller';
import { RatingService } from '../rating.service/rating.service';
import { UserService } from '../user.service/user.service';
import { RequestService } from '../request.service/request.service';

describe('RequestOfferingService', () => {
  let offeringService: RequestOfferingService;
  let plzService: PlzService;
  let requestService: RequestService;
  let userController: UserController;
  let userService: UserService;
  let userForThisTest: User;

  beforeEach(async () => {
    await setUp();
  });

  it('should be defined', () => {
    expect(offeringService).toBeDefined();
  });

  describe('save function', () => {
    it('should post a trip request offering to the db', async () => {
      const createdOffering = await postTripRequestOffering(
        userForThisTest,
        10,
        'Offering text',
        false,
        1,
      );

      const getOffering = await offeringService.getById(createdOffering.id);
      getOffering.offeringUser = null;
      getOffering.tripRequest = null;

      expect(getOffering).toEqual(createdOffering);
    });
  });

  describe('getById function', () => {
    it('should retrieve a specific trip request offering by ID', async () => {
      const createdOffering = await postTripRequestOffering(
        userForThisTest,
        15,
        'Another offering text',
        true,
        1,
      );

      const retrievedOffering = await offeringService.getById(
        createdOffering.id,
      );
      retrievedOffering.offeringUser = null;
      retrievedOffering.tripRequest = null;

      expect(retrievedOffering).toEqual(createdOffering);
    });

    it('should throw NotFoundException for non-existing trip request offering', async () => {
      await expect(offeringService.getById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllOfTripRequest function', () => {
    it('should retrieve all offerings of a specific trip request', async () => {
      const tripRequest = await postTripRequest(
        userForThisTest,
        { plz: '63679', location: 'Schotten' },
        { plz: '35390', location: 'Gießen' },
        2,
      );

      await postTripRequestOffering(
        userForThisTest,
        5,
        'Offering 1',
        true,
        tripRequest.id,
      );
      await postTripRequestOffering(
        userForThisTest,
        8,
        'Offering 2',
        false,
        tripRequest.id,
      );

      const allOfferings = await offeringService.getAllOfTripRequest(
        tripRequest.id,
      );

      expect(allOfferings.length).toEqual(2);
    });

    it('should return an empty array for non-existing trip request offerings', async () => {
      await deleteDb();
      await setUp();

      const tripRequest = await postTripRequest(
        userForThisTest,
        { plz: '12345', location: 'City1' },
        { plz: '67890', location: 'City2' },
        3,
      );

      await expect(
        offeringService.getAllOfTripRequest(tripRequest.id),
      ).resolves.toEqual([]);
    });
  });

  describe('deleteById function', () => {
    it('should delete a specific trip request offering by ID', async () => {
      const createdOffering = await postTripRequestOffering(
        userForThisTest,
        7,
        'Offering to delete',
        false,
      );

      await offeringService.deleteById(createdOffering.id);

      await expect(offeringService.getById(createdOffering.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for non-existing trip request offering', async () => {
      await expect(offeringService.deleteById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete function', () => {
    it('should delete a specific trip request offering', async () => {
      const createdOffering = await postTripRequestOffering(
        userForThisTest,
        12,
        'Offering to delete',
        true,
      );

      await offeringService.delete(createdOffering);

      await expect(offeringService.getById(createdOffering.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  const postTripRequestOffering = async (
    offeringUser: User,
    requestedCoins: number,
    text: string,
    accepted: boolean,
    tripRequestId?: number,
  ) => {
    const tR = await requestService.getById(tripRequestId);

    const tRO = new MockCreateTripRequestOffering();

    tRO.offeringUser = offeringUser;
    tRO.text = text;
    tRO.requestedCoins = requestedCoins;
    tRO.accepted = accepted;
    tRO.tripRequest = tR;

    const tROdb = await offeringService.save(tRO);
    tROdb.offeringUser = null;
    tROdb.tripRequest = null;

    return tROdb;
  };

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
    tRdB.offerings = [];
    return tRdB;
  };

  afterEach(async () => {
    await deleteDb();
  });

  const setUp = async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        sqlite_setup('./db/tmp.tester.offering.service.sqlite'),
        TypeOrmModule.forFeature(entityArr),
      ],
      controllers: [UserController],
      providers: [
        RequestOfferingService,
        PlzService,
        RatingService,
        UserService,
        RequestService,
      ],
    }).compile();

    offeringService = module.get<RequestOfferingService>(
      RequestOfferingService,
    );
    plzService = module.get<PlzService>(PlzService);

    userController = module.get<UserController>(UserController);

    requestService = module.get<RequestService>(RequestService);

    userService = module.get<UserService>(UserService);

    // create user for testing
    await userController.postUser(new MockCreateUser(false, 0));
    userForThisTest = await userService.getUserById(1);

    await postTripRequest(
      userForThisTest,
      { plz: '63679', location: 'Schotten' },
      { plz: '35390', location: 'Gießen' },
      2,
    );
  };

  const deleteDb = async () => {
    fs.unlink('./db/tmp.tester.offering.service.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  };
});
