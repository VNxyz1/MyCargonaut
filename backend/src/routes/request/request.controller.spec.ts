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
import { cargoImg, MockPostTripRequest } from './Mock/MockPostTripRequest';
import { ISession } from '../../utils/ISession';
import { MockSession } from '../user/Mocks/MockSession';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { GetTripRequestResponseDto } from './DTOs/GetTripRequestResponseDto';
import { GetAllTripRequestResponseDto } from './DTOs/GetAllTripRequestResponseDto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { MockUpdateTripRequest } from './Mock/MockUpdateTripRequest';

describe('RequestController', () => {
  let requestController: RequestController;
  let userController: UserController;
  let userService: UserService;
  let userForThisTest: User;
  let secondUserForThisTest: User;
  const session: ISession = new MockSession(true);

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
    session.userData = userForThisTest;

    await userController.postUser(new MockCreateUser(false, 1));
    secondUserForThisTest = await userService.getUserById(2);
  });

  it('should be defined', () => {
    expect(requestController).toBeDefined();
  });

  describe('post', () => {
    it('should post a trip request with a cargo image', async () => {
      await expect(
        requestController.post(new MockPostTripRequest(), session, cargoImg),
      ).resolves.toStrictEqual(
        new OKResponseWithMessageDTO(true, 'Trip request created'),
      );
    });

    it('should post a trip request without a cargo image', async () => {
      await expect(
        requestController.post(new MockPostTripRequest(), session),
      ).resolves.toStrictEqual(
        new OKResponseWithMessageDTO(true, 'Trip request created'),
      );
    });
  });

  describe('get trip request', () => {
    it('should return a trip request with a cargo image', async () => {
      await expect(requestController.getOne(1)).resolves.toBeInstanceOf(
        GetTripRequestResponseDto,
      );
      const tR = await requestController.getOne(1);
      expect(tR.cargoImg).toBeDefined();
    });

    it('should return a trip request without a cargo image', async () => {
      await expect(requestController.getOne(2)).resolves.toBeInstanceOf(
        GetTripRequestResponseDto,
      );
      const tR = await requestController.getOne(2);
      expect(tR.cargoImg).toBe(null);
    });
  });

  describe('get all trip request', () => {
    it('should return a array of trip requests', async () => {
      await expect(requestController.getAll()).resolves.toBeInstanceOf(
        GetAllTripRequestResponseDto,
      );
      const tRArr = await requestController.getAll();
      expect(tRArr.tripRequests).toHaveLength(2);
      expect(tRArr.tripRequests.find((tR) => tR.id === 1)).toStrictEqual(
        await requestController.getOne(1),
      );
    });
  });

  describe('delete a trip request', () => {
    it('should delete the trip request with id 2', async () => {
      await expect(requestController.delete(2, session)).resolves.toStrictEqual(
        new OKResponseWithMessageDTO(true, 'Transit request was deleted.'),
      );
    });

    it('should throw a error, when trying to delete trip request with id 2', async () => {
      await expect(requestController.delete(2, session)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a error, when trying to delete a trip request of which the logged in user is not the owner', async () => {
      session.userData = secondUserForThisTest;
      await expect(requestController.delete(1, session)).rejects.toThrow(
        ForbiddenException,
      );
      session.userData = userForThisTest;
    });
  });

  describe('updateParams function', () => {
    it('should update the startPlz', async () => {
      const updateData = new MockUpdateTripRequest(true);
      await expect(
        requestController.updateParams(1, session, updateData),
      ).resolves.toStrictEqual(
        new OKResponseWithMessageDTO(true, 'Update successful.'),
      );
      const tR = await requestController.getOne(1);
      expect(tR.startPlz.plz).toBe(updateData.startPlz.plz);
      expect(tR.startPlz.location).toBe(updateData.startPlz.location);
    });

    it('should update the endPlz', async () => {
      const updateData = new MockUpdateTripRequest(false, true);
      await expect(
        requestController.updateParams(1, session, updateData),
      ).resolves.toStrictEqual(
        new OKResponseWithMessageDTO(true, 'Update successful.'),
      );
      const tR = await requestController.getOne(1);
      expect(tR.endPlz.plz).toBe(updateData.endPlz.plz);
      expect(tR.endPlz.location).toBe(updateData.endPlz.location);
    });

    it('should update the startPlz and endPlz', async () => {
      const updateData = new MockUpdateTripRequest(true, true);
      await expect(
        requestController.updateParams(1, session, updateData),
      ).resolves.toStrictEqual(
        new OKResponseWithMessageDTO(true, 'Update successful.'),
      );
      const tR = await requestController.getOne(1);
      expect(tR.endPlz.plz).toBe(updateData.endPlz.plz);
      expect(tR.endPlz.location).toBe(updateData.endPlz.location);
      expect(tR.startPlz.plz).toBe(updateData.startPlz.plz);
      expect(tR.startPlz.location).toBe(updateData.startPlz.location);
    });
  });

  afterAll(async () => {
    fs.unlink('./db/tmp.tester.request.controller.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });
});
