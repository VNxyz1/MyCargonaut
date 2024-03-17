import { Test, TestingModule } from '@nestjs/testing';
import { TransitRequestController } from './transit-request.controller';
import { AuthController } from '../auth/auth.controller';
import { User } from '../../database/User';
import { ISession } from '../../utils/ISession';
import { MockSession } from '../user/Mocks/MockSession';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user.service/user.service';
import { AuthService } from '../auth.service/auth.service';
import { TransitRequestService } from '../transit-request.service/transit-request.service';
import { OfferService } from '../offer.service/offer.service';
import * as fs from 'fs';
import { MockPostOffer } from '../offer/Mock/MockPostOffer';
import { OfferController } from '../offer/offer.controller';
import { UserController } from '../user/user.controller';
import { MockCreateUser } from '../user/Mocks/MockCreateUser';
import { MockPostTransitRequest } from './Mock/MockPostTransitRequest';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { entityArr, sqlite_setup } from '../../utils/sqlite_setup';
import { PlzService } from '../plz.service/plz.service';
import { RatingService } from '../rating.service/rating.service';
import { VehicleController } from '../vehicle/vehicle.controller';
import { VehicleService } from '../vehicle.service/vehicle.service';
import { MockVehicle } from '../vehicle/Mock/MockVehicle';
import { MessageGatewayService } from '../../socket/message.gateway.service';
import { MessageService } from '../message.service/message.service';

describe('TransitRequestController', () => {
  let transitController: TransitRequestController;
  let transitService: TransitRequestService;
  let vehicleService: VehicleService;
  let offerController: OfferController;
  let userController: UserController;
  let userService: UserService;
  let providerForThisTest: User;
  let secondProviderForThisTest: User;
  let userForThisTest: User;
  let session: ISession = new MockSession(true);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        sqlite_setup('./db/tmp.tester.transit.controller.sqlite'),
        TypeOrmModule.forFeature(entityArr),
      ],
      controllers: [
        AuthController,
        TransitRequestController,
        OfferController,
        UserController,
        VehicleController,
      ],
      providers: [
        UserService,
        AuthService,
        TransitRequestService,
        OfferService,
        PlzService,
        RatingService,
        VehicleService,
        MessageGatewayService,
        MessageService,
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    offerController = module.get<OfferController>(OfferController);
    transitController = module.get<TransitRequestController>(TransitRequestController);
    transitService = module.get<TransitRequestService>(TransitRequestService);
    vehicleService = module.get<VehicleService>(VehicleService);
    // create users for testing
    await userController.postUser(new MockCreateUser(true, 0));
    providerForThisTest = await userService.getUserById(1);
    await vehicleService.creatingVehicle(1, new MockVehicle(1));

    await userController.postUser(new MockCreateUser(false, 1));
    userForThisTest = await userService.getUserById(2);
    await vehicleService.creatingVehicle(2, new MockVehicle(2));

    await userController.postUser(new MockCreateUser(true, 2));
    secondProviderForThisTest = await userService.getUserById(3);
    await vehicleService.creatingVehicle(3, new MockVehicle(3));

    // post first offer
    runTestAsProvider();
    await postNewOffer(1);

    // post second offer
    runTestAsSecondProvider();
    await postNewOffer(3);
  });

  it('should be defined', () => {
    expect(transitController).toBeDefined();
  });

  describe('postTransitRequest', () => {
    it('should create a transit request successfully', async () => {
      runTestAsClient();
      const body = new MockPostTransitRequest();

      const result = await transitController.postTransitRequest(session, 1, body);

      expect(result).toBeDefined();
      expect(result).toStrictEqual(new OKResponseWithMessageDTO(true, 'Request was sent'));
    });

    it('should throw an exception if the offer does not exist', async () => {
      runTestAsClient();
      const nonExistingOfferId = 999;
      const body = new MockPostTransitRequest();

      await expect(transitController.postTransitRequest(session, nonExistingOfferId, body)).rejects.toThrow();
    });

    it('should throw an exception if the requesting user is the offer provider', async () => {
      runTestAsProvider();
      const body = new MockPostTransitRequest();

      await expect(transitController.postTransitRequest(session, 1, body)).rejects.toThrow(
        new ForbiddenException('You are not allowed to make a request to your own offer'),
      );
    });

    it('should throw an exception if the requested seats are not provided', async () => {
      runTestAsClient();
      const body = new MockPostTransitRequest();
      body.requestedSeats = undefined;

      await expect(transitController.postTransitRequest(session, 1, body)).rejects.toThrow();
    });

    it('should throw an exception if the offered coins are not provided', async () => {
      runTestAsClient();
      const body = new MockPostTransitRequest();
      body.offeredCoins = undefined;

      await expect(transitController.postTransitRequest(session, 1, body)).rejects.toThrow();
    });
  });

  describe('getPendingTransitrequestOfUser', () => {
    it('should get all pending transit requests for the logged-in user', async () => {
      runTestAsClient();
      const result = await transitController.getPendingTransitRequestOfLoggedInUser(session);

      expect(result).toBeDefined();
      expect(result.transitRequests).toHaveLength(1);
      expect(result.transitRequests[0].requester).toBeDefined();
      expect(result.transitRequests[0].offer).toBeDefined();
      expect(result.transitRequests[0].requestedSeats).toBeDefined();
      expect(result.transitRequests[0].offeredCoins).toBeDefined();
    });

    it('should return an empty array if the user is not logged in', async () => {
      runTestAsLoggedOutUser();
      const result = await transitController.getPendingTransitRequestOfLoggedInUser(session);

      expect(result.transitRequests).toHaveLength(0);
    });
  });

  describe('putTransitRequest', () => {
    it('should update the offered coins of a transit request', async () => {
      runTestAsClient();
      const updatedOfferedCoins = 230;

      const result = await transitController.putTransitRequest(session, 1, {
        offeredCoins: updatedOfferedCoins,
      });
      const updatedRequest = await transitService.getTransitRequestById(1);

      expect(result).toBeDefined();
      expect(updatedRequest.offeredCoins).toBe(updatedOfferedCoins);
    });

    it('should update the requested seats of a transit request', async () => {
      runTestAsClient();
      const updatedSeats = 3;

      const result = await transitController.putTransitRequest(session, 1, {
        requestedSeats: updatedSeats,
      });
      const updatedRequest = await transitService.getTransitRequestById(1);

      expect(result).toBeDefined();
      expect(updatedRequest.requestedSeats).toBe(updatedSeats);
    });

    it('should update all params of a transit request', async () => {
      runTestAsClient();
      const updatedSeats = 1;
      const updatedOfferedCoins = 200;

      const result = await transitController.putTransitRequest(session, 1, {
        offeredCoins: updatedOfferedCoins,
        requestedSeats: updatedSeats,
      });
      const updatedRequest = await transitService.getTransitRequestById(1);

      expect(result).toBeDefined();
      expect(updatedRequest.requestedSeats).toBe(updatedSeats);
      expect(updatedRequest.offeredCoins).toBe(updatedOfferedCoins);
    });

    it('should throw an exception if both offered coins and requested seats are not provided', async () => {
      runTestAsClient();
      const body = {};

      await expect(transitController.putTransitRequest(session, 1, body)).rejects.toThrow(
        new BadRequestException('Please provide at least one of both props'),
      );
    });
  });

  describe('acceptRequest', () => {
    it('should accept a transit request and update client balances', async () => {
      await setCoinBalanceOfUser(1, 500);
      await setCoinBalanceOfUser(2, 500);

      runTestAsProvider();

      const result = await transitController.acceptRequest(session, 1);

      const coinBalanceOfProvider = await userService.getCoinBalanceOfUser(1);
      const coinBalanceOfClient = await userService.getCoinBalanceOfUser(2);

      expect(result).toBeDefined();
      expect(result).toStrictEqual(new OKResponseWithMessageDTO(true, 'Request was accepted'));
      expect(coinBalanceOfProvider).toBe(500);
      expect(coinBalanceOfClient).toBe(300);
    });

    it('should throw an exception if the request is not made to the logged-in users offer', async () => {
      runTestAsClient();
      await transitController.postTransitRequest(session, 2, new MockPostTransitRequest());

      runTestAsProvider();
      const nonMatchingRequestId = 2;

      await expect(transitController.acceptRequest(session, nonMatchingRequestId)).rejects.toThrow(
        new ForbiddenException('You are not allowed to mark this request as accepted'),
      );
    });

    it('should throw an exception if the users coin balance is not valid', async () => {
      // sets coin balance of requesting user to 0
      await setCoinBalanceOfUser(2, 0);

      runTestAsSecondProvider();

      await expect(transitController.acceptRequest(session, 2)).rejects.toThrow(
        new ForbiddenException('The coin balance of the requesting user is not valid.'),
      );
    });
  });

  describe('deleteTransitRequest', () => {
    it('should delete a transit request', async () => {
      runTestAsClient();
      const result = await transitController.deleteTransitRequest(session, 2);

      expect(result).toBeDefined();
      expect(result).toStrictEqual(new OKResponseWithMessageDTO(true, 'Request was deleted'));
      await expect(transitService.getTransitRequestById(2)).rejects.toThrow(
        new NotFoundException('No pending transit requests found'),
      );
    });

    it('should throw an exception if the logged-in user is not the requester', async () => {
      await transitController.postTransitRequest(session, 2, new MockPostTransitRequest());
      runTestAsProvider();

      await expect(transitController.deleteTransitRequest(session, 3)).rejects.toThrow(
        new ForbiddenException('You are not allowed to delete this Request.'),
      );
    });
  });

  afterAll(async () => {
    fs.unlink('./db/tmp.tester.transit.controller.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });

  const setCoinBalanceOfUser = async (userId: number, newCoinBalance: number) => {
    await userService.setCoinBalanceOfUser(userId, newCoinBalance);
  };

  const runTestAsProvider = () => {
    session = new MockSession(true);
    session.userData = providerForThisTest;
  };

  const runTestAsSecondProvider = () => {
    session = new MockSession(true);
    session.userData = secondProviderForThisTest;
  };

  const runTestAsClient = () => {
    session = new MockSession(true);
    session.userData = userForThisTest;
  };

  const runTestAsLoggedOutUser = () => {
    session = new MockSession();
  };

  const postNewOffer = async (vehicleId) => {
    const createOfferDto = new MockPostOffer(vehicleId);
    return await offerController.postUser(createOfferDto, session);
  };
});
