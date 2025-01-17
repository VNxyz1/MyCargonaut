import { Test, TestingModule } from '@nestjs/testing';
import { RequestController } from './request.controller';
import { RequestService } from '../request.service/request.service';
import { UserController } from '../user/user.controller';
import { UserService } from '../user.service/user.service';
import { PlzService } from '../plz.service/plz.service';
import { User } from '../../database/User';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { GetFilteredTripRequestRequestDto } from './DTOs/GetFilteredTripRequestRequestDto';
import { entityArr, sqlite_setup } from '../../utils/sqlite_setup';
import { RatingService } from '../rating.service/rating.service';
import { RequestOfferingService } from '../request-offering.service/request-offering.service';
import { MockPostOffering } from './Mock/MockPostOffering';
import { OfferService } from '../offer.service/offer.service';
import { CreateRoutePartDto } from '../offer/DTOs/CreateRoutePartDto';
import { Offer } from '../../database/Offer';
import { VehicleService } from '../vehicle.service/vehicle.service';
import { MockVehicle } from '../vehicle/Mock/MockVehicle';
import { MessageGatewayService } from '../../socket/message.gateway.service';
import { MessageService } from '../message.service/message.service';

describe('RequestController', () => {
  let requestService: RequestService;
  let requestController: RequestController;
  let offeringService: RequestOfferingService;
  let offerService: OfferService;
  let ratingService: RatingService;
  let userController: UserController;
  let userService: UserService;
  let userForThisTest: User;
  let offeringUser: User;
  let vehicleService: VehicleService;
  const session: ISession = new MockSession(true);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        sqlite_setup('./db/tmp.tester.request.controller.sqlite'),
        TypeOrmModule.forFeature(entityArr),
      ],
      controllers: [UserController, RequestController],
      providers: [
        UserService,
        PlzService,
        RequestService,
        RatingService,
        RequestOfferingService,
        OfferService,
        VehicleService,
        RatingService,
        MessageGatewayService,
        MessageService,
      ],
    }).compile();

    offerService = module.get<OfferService>(OfferService);
    requestService = module.get<RequestService>(RequestService);
    offeringService = module.get<RequestOfferingService>(RequestOfferingService);
    vehicleService = module.get<VehicleService>(VehicleService);
    userService = module.get<UserService>(UserService);
    requestController = module.get<RequestController>(RequestController);
    userController = module.get<UserController>(UserController);
    ratingService = module.get<RatingService>(RatingService);

    // create users for testing
    await userController.postUser(new MockCreateUser(false, 0));
    userForThisTest = await userService.getUserById(1);
    session.userData = userForThisTest;
    await ratingService.createRating({
      cargoArrivedUndamaged: 4,
      comfortDuringTrip: 4,
      comment: undefined,
      complete: true,
      driver: true,
      id: undefined,
      passengerPleasantness: 4,
      punctuality: 4,
      rated: await userService.getUserById(1),
      rater: undefined,
      reliability: 5,
      trip: undefined,
      totalRating: 4,
    });

    await userController.postUser(new MockCreateUser(true, 1));
    offeringUser = await userService.getUserById(2);
    await vehicleService.creatingVehicle(2, new MockVehicle(1));
  });

  it('should be defined', () => {
    expect(requestController).toBeDefined();
  });

  describe('post', () => {
    it('should post a trip request with a cargo image', async () => {
      await expect(
        requestController.post(new MockPostTripRequest(), session, cargoImg),
      ).resolves.toStrictEqual(new OKResponseWithMessageDTO(true, 'Trip request created'));
    });

    it('should post a trip request without a cargo image', async () => {
      await expect(requestController.post(new MockPostTripRequest(), session)).resolves.toStrictEqual(
        new OKResponseWithMessageDTO(true, 'Trip request created'),
      );
    });
  });

  describe('get trip request', () => {
    it('should return a trip request with a cargo image', async () => {
      await expect(requestController.getOne(1)).resolves.toBeInstanceOf(GetTripRequestResponseDto);
      const tR = await requestController.getOne(1);
      expect(tR.cargoImg).toBeDefined();
    });

    it('should return a trip request without a cargo image', async () => {
      await expect(requestController.getOne(2)).resolves.toBeInstanceOf(GetTripRequestResponseDto);
      const tR = await requestController.getOne(2);
      expect(tR.cargoImg).toBe(null);
    });
  });

  describe('get all trip request', () => {
    it('should return a array of trip requests', async () => {
      await expect(requestController.getAll()).resolves.toBeInstanceOf(GetAllTripRequestResponseDto);
      const tRArr = await requestController.getAll();
      expect(tRArr.tripRequests).toHaveLength(2);
      expect(tRArr.tripRequests.find((tR) => tR.id === 1)).toStrictEqual(await requestController.getOne(1));
    });
  });

  describe('delete a trip request', () => {
    it('should delete the trip request with id 2', async () => {
      await expect(requestController.delete(2, session)).resolves.toStrictEqual(
        new OKResponseWithMessageDTO(true, 'Transit request was deleted.'),
      );
    });

    it('should throw a error, when trying to delete trip request with id 2', async () => {
      await expect(requestController.delete(2, session)).rejects.toThrow(NotFoundException);
    });

    it('should throw a error, when trying to delete a trip request of which the logged in user is not the owner', async () => {
      session.userData = offeringUser;
      await expect(requestController.delete(1, session)).rejects.toThrow(ForbiddenException);
      session.userData = userForThisTest;
    });
  });

  describe('updateParams function', () => {
    it('should update the startPlz', async () => {
      const updateData = new MockUpdateTripRequest(true);
      await expect(requestController.updateParams(1, session, updateData)).resolves.toStrictEqual(
        new OKResponseWithMessageDTO(true, 'Update successful.'),
      );
      const tR = await requestController.getOne(1);
      expect(tR.startPlz.plz).toBe(updateData.startPlz.plz);
      expect(tR.startPlz.location).toBe(updateData.startPlz.location);
    });

    it('should update the endPlz', async () => {
      const updateData = new MockUpdateTripRequest(false, true);
      await expect(requestController.updateParams(1, session, updateData)).resolves.toStrictEqual(
        new OKResponseWithMessageDTO(true, 'Update successful.'),
      );
      const tR = await requestController.getOne(1);
      expect(tR.endPlz.plz).toBe(updateData.endPlz.plz);
      expect(tR.endPlz.location).toBe(updateData.endPlz.location);
    });

    it('should update the startPlz and endPlz', async () => {
      const updateData = new MockUpdateTripRequest(true, true);
      await expect(requestController.updateParams(1, session, updateData)).resolves.toStrictEqual(
        new OKResponseWithMessageDTO(true, 'Update successful.'),
      );
      const tR = await requestController.getOne(1);
      expect(tR.endPlz.plz).toBe(updateData.endPlz.plz);
      expect(tR.endPlz.location).toBe(updateData.endPlz.location);
      expect(tR.startPlz.plz).toBe(updateData.startPlz.plz);
      expect(tR.startPlz.location).toBe(updateData.startPlz.location);
    });
  });

  describe('filter function', () => {
    it('should get filtered trip requests by search string', async () => {
      const query = new GetFilteredTripRequestRequestDto();
      query.searchString = '67890';
      const filteredRequests = await requestController.getFilter(query);
      expect(filteredRequests.tripRequests.length).toBe(1);
    });

    it('should get filtered trip requests by seats', async () => {
      const query = new GetFilteredTripRequestRequestDto();
      query.seats = '6';
      const filteredRequests = await requestController.getFilter(query);
      expect(filteredRequests.tripRequests.length).toBe(1);
    });

    it('should get filtered trip requests by seats. There are no trip requests with 1 or less seats.', async () => {
      const query = new GetFilteredTripRequestRequestDto();
      query.seats = '1';
      const filteredRequests = await requestController.getFilter(query);
      expect(filteredRequests.tripRequests.length).toBe(0);
    });

    it('should get filtered trip requests by fromPLZ', async () => {
      const query = new GetFilteredTripRequestRequestDto();
      query.fromPLZ = '67890';
      const filteredRequests = await requestController.getFilter(query);
      expect(filteredRequests.tripRequests.length).toBe(0);
    });

    it('should get filtered trip requests by toPlz', async () => {
      const query = new GetFilteredTripRequestRequestDto();
      query.toPLZ = '67890';
      const filteredRequests = await requestController.getFilter(query);
      expect(filteredRequests.tripRequests.length).toBe(1);
    });

    it('should get filtered trip requests by from- toPlz', async () => {
      const query = new GetFilteredTripRequestRequestDto();
      query.toPLZ = '67890';
      query.fromPLZ = '12345';
      const filteredRequests = await requestController.getFilter(query);
      expect(filteredRequests.tripRequests.length).toBe(1);
    });

    it('should get filtered trip requests by from- toPlz (not existing)', async () => {
      const query = new GetFilteredTripRequestRequestDto();
      query.toPLZ = '67890';
      query.fromPLZ = '67878';
      const filteredRequests = await requestController.getFilter(query);
      expect(filteredRequests.tripRequests.length).toBe(0);
    });

    it('should get filtered trip requests by rating', async () => {
      const query = new GetFilteredTripRequestRequestDto();
      query.rating = '4';
      const filteredRequests = await requestController.getFilter(query);
      expect(filteredRequests.tripRequests.length).toBe(1);
    });

    it('should get filtered trip requests by rating. No 5 Star Ratings exist.', async () => {
      const query = new GetFilteredTripRequestRequestDto();
      query.rating = '5';
      const filteredRequests = await requestController.getFilter(query);
      expect(filteredRequests.tripRequests.length).toBe(0);
    });

    it('should get filtered trip requests by rating. No 3 Star Ratings exist.', async () => {
      const query = new GetFilteredTripRequestRequestDto();
      query.rating = '3';
      const filteredRequests = await requestController.getFilter(query);
      expect(filteredRequests.tripRequests.length).toBe(0);
    });
  });

  describe('offerTransit', () => {
    it('should send an offering to the requester of the request with the given ID', async () => {
      session.userData = offeringUser;

      const offering = new MockPostOffering();

      expect(await requestController.offerTransit(session, 1, offering)).toStrictEqual(
        new OKResponseWithMessageDTO(true, 'Offer was send.'),
      );

      const offerings = await offeringService.getAllOfTripRequest(1);
      expect(offerings.length).toBe(1);
    });
  });

  describe('getOfferingsAsOfferingUser', () => {
    it('should get all pending Offerings that you offered.', async () => {
      session.userData = userForThisTest;
      await expect(requestController.post(new MockPostTripRequest(), session)).resolves.toStrictEqual(
        new OKResponseWithMessageDTO(true, 'Trip request created'),
      );

      session.userData = offeringUser;
      const offerings = await requestController.getOfferingsAsOfferingUser(session);

      const offering = new MockPostOffering();
      offering.text = 'Kalle, was soll das? Nim mal an jetzt!!';
      await requestController.offerTransit(session, 3, offering);

      const newOfferings = await requestController.getOfferingsAsOfferingUser(session);
      expect(newOfferings.length).toBe(offerings.length + 1);
      expect(newOfferings[newOfferings.length - 1].text).toBe(offering.text);
    });
  });

  describe('getOfferingsAsRequestingUser', () => {
    it('should get all pending Offerings for which trip request you are the requester', async () => {
      session.userData = userForThisTest;
      const offerings = await requestController.getOfferingsAsRequestingUser(session);

      expect(offerings.length).toBe(2);
    });
  });

  describe('acceptOffering', () => {
    it('should accept a offering with the given id. And executes the payment action if the user has enough coins.', async () => {
      session.userData = userForThisTest;
      const offering = await offeringService.getById(1);
      expect(offering.accepted).toBe(false);

      const coinbalanceOfRequester = 500;
      const coinbalanceOfOfferingUser = 500;
      await userService.setCoinBalanceOfUser(session.userData.id, coinbalanceOfRequester);
      await userService.setCoinBalanceOfUser(offering.offeringUser.id, coinbalanceOfOfferingUser);

      const acceptedOffering = await requestController.acceptOffering(session, 1);
      expect(acceptedOffering.message).toBe('Offering was accepted.');

      const updatedOffering = await offeringService.getById(1);
      expect(updatedOffering.accepted).toBe(true);

      const newCoinbalanceOfRequester = await userService.getCoinBalanceOfUser(session.userData.id);
      const newCoinbalanceOfOfferingUser = await userService.getCoinBalanceOfUser(offering.offeringUser.id);
      expect(newCoinbalanceOfRequester).toBe(coinbalanceOfRequester - offering.requestedCoins);
      expect(newCoinbalanceOfOfferingUser).toBe(coinbalanceOfOfferingUser + offering.requestedCoins);
    });
  });

  describe('transformToOffer', () => {
    it('should throw a error, when trying to transform an offering, of which the logged in user is not the owner', async () => {
      session.userData = userForThisTest;
      await expect(
        requestController.transformToOffer(session, 1, {
          additionalSeats: 1,
          vehicleId: 1,
          startDate: 'startDate',
          description: 'description',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should transform the TripRequest, with an accepted Offering to an Offer.', async () => {
      session.userData = offeringUser;
      const additionalSeats = 1;
      const vehicleId = 1;
      const startDate = '2024-01-13T12:00:00+01:00';
      const description = 'Test offer with extended route';

      const crp1 = new CreateRoutePartDto();
      const crp2 = new CreateRoutePartDto();
      crp1.plz = '67890';
      crp1.location = 'wah';
      crp1.position = 1;

      crp2.plz = '12345';
      crp2.location = 'rio';
      crp2.position = 2;

      const route = [crp1, crp2];
      await requestController.transformToOffer(session, 1, {
        additionalSeats: additionalSeats,
        vehicleId: vehicleId,
        startDate: startDate,
        description: description,
        route: route,
      });

      const offer = await offerService.getOffer(1);
      expect(offer).toBeInstanceOf(Offer);
      expect(offer.provider.id).toBe(offeringUser.id);
      expect(offer.clients[0].id).toBe(userForThisTest.id);
      expect(offer.description).toBe(description);
      expect(offer.startDate).toStrictEqual(new Date(startDate));

      await expect(requestService.getOpenById(1)).rejects.toThrow(NotFoundException);
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
