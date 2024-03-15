import { Test, TestingModule } from '@nestjs/testing';
import { OfferController } from './offer.controller';
import { AuthController } from '../auth/auth.controller';
import { User } from '../../database/User';
import { ISession } from '../../utils/ISession';
import { MockSession } from '../user/Mocks/MockSession';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth.service/auth.service';
import { OfferService } from '../offer.service/offer.service';
import * as fs from 'fs';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { MockPostOffer } from './Mock/MockPostOffer';
import { GetOfferResponseDto } from './DTOs/GetOfferResponseDto';
import { UserController } from '../user/user.controller';
import { UserService } from '../user.service/user.service';
import { MockCreateUser } from '../user/Mocks/MockCreateUser';
import { MockUpdateOffer } from '../offer.service/Mock/MockUpdateOffer';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { TripState } from '../../database/TripState';
import { entityArr, sqlite_setup } from '../../utils/sqlite_setup';
import { PlzService } from '../plz.service/plz.service';
import { RatingService } from '../rating.service/rating.service';
import { VehicleService } from '../vehicle.service/vehicle.service';
import { MockVehicle } from '../vehicle/Mock/MockVehicle';
import { GetAllOffersResponseDto } from './DTOs/GetAllOffersResponseDto';

describe('OfferController', () => {
  let offerController: OfferController;
  let offerService: OfferService;
  let userController: UserController;
  let userService: UserService;
  let ratingService: RatingService;
  let providerForThisTest: User;
  let userForThisTest: User;
  let session: ISession = new MockSession(true);
  let vehicleService: VehicleService;
  beforeAll(async () => {
    await setup();
  });

  it('should be defined', () => {
    expect(offerController).toBeDefined();
  });

  describe('post offers', () => {
    it('should create a new offer', async () => {
      runTestAsProvider();
      const result = await postNewOffer(1);

      expect(result).toEqual(new OKResponseWithMessageDTO(true, 'Offer Created'));
    });

    it('should throw an error, because the user is not a provider', async () => {
      runTestAsClient();

      await expect(postNewOffer(2)).rejects.toThrow();
    });
  });

  describe('get offers', () => {
    it('should get all offers as not registered user', async () => {
      runTestAsLoggedOutUser();
      const result = await offerController.getAllOffers();
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(1);
      expect(result.offerList[0]).toBeInstanceOf(GetOfferResponseDto);
    });

    it('should get all offers as registered user', async () => {
      runTestAsClient();
      const result = await offerController.getAllOffers();
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(1);
      expect(result.offerList[0]).toBeInstanceOf(GetOfferResponseDto);
    });

    it('should get offers of logged in user, that has posted an offer', async () => {
      runTestAsProvider();
      const result = await offerController.getOffersOfLoggedInUser(session);
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(1);
      expect(result.offerList[0].provider.id).toBe(session.userData.id);
    });

    it('should get offers of logged in user, that has not posted an offer', async () => {
      runTestAsClient();
      const result = await offerController.getOffersOfLoggedInUser(session);
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(0);
    });
  });

  describe('update properties route', () => {
    it('should update the selected offer', async () => {
      runTestAsProvider();
      const offerId = 1;
      const updateOfferDto = new MockUpdateOffer();
      const result = await offerController.updateOffer(session, offerId, updateOfferDto);
      expect(result).toEqual(new OKResponseWithMessageDTO(true, 'Offer Updated'));
    });

    it('should throw BadRequestException when updating offer with different provider', async () => {
      runTestAsClient();
      const offerId = 1;
      const updateOfferDto = new MockUpdateOffer();

      await expect(offerController.updateOffer(session, offerId, updateOfferDto)).rejects.toThrow(
        'You are not the Provider of this Offer!',
      );
    });

    it('should throw BadRequestException when updating non-existing offer', async () => {
      runTestAsProvider();
      const nonExistingOfferId = 999;
      const updateOfferDto = new MockUpdateOffer();

      await expect(offerController.updateOffer(session, nonExistingOfferId, updateOfferDto)).rejects.toThrow(
        new InternalServerErrorException('Offer was not found!'),
      );
    });
  });

  describe('delete route', () => {
    it('should delete the offer', async () => {
      runTestAsProvider();
      const offerId = 1;
      const result = await offerController.deleteOffer(session, offerId);
      expect(result).toEqual(new OKResponseWithMessageDTO(true, 'Offer Deleted'));
    });

    it('should throw BadRequestException when deleting offer with different provider', async () => {
      runTestAsProvider();
      await postNewOffer(1);

      runTestAsClient();
      const offerId = 2;

      await expect(offerController.deleteOffer(session, offerId)).rejects.toThrow(
        'You are not the Provider of this Offer!',
      );
    });
    it('should throw BadRequestException when deleting non-existing offer', async () => {
      runTestAsProvider();
      const nonExistingOfferId = 999;

      await expect(offerController.deleteOffer(session, nonExistingOfferId)).rejects.toThrow(
        new InternalServerErrorException('Offer was not found!'),
      );
    });

    it('should throw BadRequestException when deleting offer with invalid id', async () => {
      runTestAsProvider();
      const invalidOfferId = 'invalid';

      await expect(offerController.deleteOffer(session, Number(invalidOfferId))).rejects.toThrow(
        'SQLITE_ERROR: no such column: NaN',
      );
    });
  });

  describe('set offer as booked up route', () => {
    it('should reject the request', async () => {
      runTestAsProvider();
      await postNewOffer(1);

      runTestAsClient();
      const offerId = 3;

      await expect(offerController.setOfferAsBookedUp(session, offerId)).rejects.toThrow(
        new BadRequestException('You are not the Provider of this Offer!'),
      );
    });

    it('should set the offer as booked up', async () => {
      runTestAsProvider();

      const offerId = 3;

      await expect(offerController.setOfferAsBookedUp(session, offerId)).resolves.toEqual(
        new OKResponseWithMessageDTO(true, 'Offer is set as booked up'),
      );

      const offer = await offerService.getOffer(offerId);
      expect(offer.state).toBe(TripState.bookedUp);
    });
  });

  describe('reopen offer route', () => {
    it('should reject the request', async () => {
      runTestAsClient();
      const offerId = 3;

      await expect(offerController.reopenOffer(session, offerId)).rejects.toThrow(
        new BadRequestException('You are not the Provider of this Offer!'),
      );
    });

    it('should reopen the offer', async () => {
      runTestAsProvider();

      const offerId = 3;

      await expect(offerController.reopenOffer(session, offerId)).resolves.toEqual(
        new OKResponseWithMessageDTO(true, 'Offer is reopened'),
      );

      const offer = await offerService.getOffer(offerId);
      expect(offer.state).toBe(TripState.offer);
    });
  });

  describe('get filtered offers route', () => {
    it('should get filtered offers', async () => {
      runTestAsProvider();
      await postNewOffer(1, true);
      await postNewOffer(1);

      runTestAsLoggedOutUser();
      const searchString = 'test';
      const result: GetAllOffersResponseDto = await offerController.getFilteredOffers({
        searchString: searchString,
        fromPLZ: '63679',
        toPLZ: '64002',
      });
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(3);
      expect(result.offerList[0].description.toLowerCase().includes(searchString)).toBe(true);
    });

    it('should return an empty list, because there is no connection between the two plz', async () => {
      runTestAsLoggedOutUser();
      const result: GetAllOffersResponseDto = await offerController.getFilteredOffers({
        fromPLZ: '35390',
        toPLZ: '64002',
      });
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(0);
    });

    it('should get filtered offers by route v2', async () => {
      runTestAsLoggedOutUser();
      const result: GetAllOffersResponseDto = await offerController.getFilteredOffers({
        fromPLZ: '64002',
        toPLZ: '63679',
      });
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(1);
    });

    it('should return an empty list, because there is no connection between the two plz', async () => {
      runTestAsLoggedOutUser();
      const result: GetAllOffersResponseDto = await offerController.getFilteredOffers({
        fromPLZ: '64002',
        toPLZ: '64002',
      });
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(0);
    });

    it('should get two offers, filtered by date', async () => {
      runTestAsLoggedOutUser();
      const date = '2024-02-01';
      const result: GetAllOffersResponseDto = await offerController.getFilteredOffers({
        date: date,
      });
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(4);
      //is the list sorted:
      expect(result.offerList[0].startDate.getTime()).toBeLessThanOrEqual(
        result.offerList[1].startDate.getTime(),
      );
    });

    it('should get one offer, filtered by date', async () => {
      runTestAsLoggedOutUser();
      const date = '2024-02-18';
      const result: GetAllOffersResponseDto = await offerController.getFilteredOffers({
        date: date,
      });
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(3);
    });

    it('should get filtered offers with search string, route, and date', async () => {
      runTestAsLoggedOutUser();
      const searchString = 'test';
      const date = '2024-01-01';
      const result: GetAllOffersResponseDto = await offerController.getFilteredOffers({
        searchString: searchString,
        toPLZ: '63679',
        fromPLZ: '64002',
        date: date
      });
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(1);
      expect(result.offerList[0].description.toLowerCase().includes(searchString));
      expect(result.offerList[0].startDate.getTime()).toBeGreaterThanOrEqual(new Date(date).getTime());
    });

    it('should get filtered offers with 4 star ratings', async () => {
      runTestAsLoggedOutUser();
      const result: GetAllOffersResponseDto = await offerController.getFilteredOffers({
        rating: '4',
      });
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(4);
      const userRating = await ratingService.selectAverageRatingForUser(result.offerList[0].provider.id);
      expect(userRating.total).toEqual(4);
    });
    it('should return nothing, since there are no 3 star ratings.', async () => {
      runTestAsLoggedOutUser();
      const result: GetAllOffersResponseDto = await offerController.getFilteredOffers({
        rating: '3',
      });
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(0);
    });
    it('should return nothing, since there are no 5 star ratings.', async () => {
      runTestAsLoggedOutUser();
      const result: GetAllOffersResponseDto = await offerController.getFilteredOffers({
        rating: '5',
      });
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(0);
    });
    it('should return offers, with 1 or more available seats.', async () => {
      runTestAsLoggedOutUser();
      const result: GetAllOffersResponseDto = await offerController.getFilteredOffers({
        seats: '1',
      });
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(4);
    });

    it('should return offers, with 2 or more available seats.', async () => {
      runTestAsLoggedOutUser();
      const result: GetAllOffersResponseDto = await offerController.getFilteredOffers({
        seats: '2',
      });
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(3);
    });

    it('should return offers, with 3 or more available seats', async () => {
      runTestAsLoggedOutUser();
      const result: GetAllOffersResponseDto = await offerController.getFilteredOffers({
        seats: '3',
      });
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(3);
    });

    it('should return offers, with 4 or more available seats (none existing)', async () => {
      runTestAsLoggedOutUser();
      const result: GetAllOffersResponseDto = await offerController.getFilteredOffers({
        seats: '4',
      });
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(0);
    });
  });

  afterAll(async () => {
    await deleteDbMock();
  });

  const runTestAsProvider = () => {
    session = new MockSession(true);
    session.userData = providerForThisTest;
  };

  const runTestAsClient = () => {
    session = new MockSession(true);
    session.userData = userForThisTest;
  };

  const runTestAsLoggedOutUser = () => {
    session = new MockSession();
  };

  const postNewOffer = async (vehicleId: number, alt?: boolean) => {
    let createOfferDto: MockPostOffer;
    if (alt) {
      createOfferDto = new MockPostOffer(vehicleId, alt);
    } else {
      createOfferDto = new MockPostOffer(vehicleId);
    }
    return await offerController.postUser(createOfferDto, session);
  };

  const setup = async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [sqlite_setup('./db/tmp.tester.offer.controller.sqlite'), TypeOrmModule.forFeature(entityArr)],
      controllers: [UserController, AuthController, OfferController],
      providers: [
        UserService,
        AuthService,
        OfferService,
        PlzService,
        RatingService,
        VehicleService,
        RatingService,
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    offerController = module.get<OfferController>(OfferController);
    offerService = module.get<OfferService>(OfferService);
    vehicleService = module.get<VehicleService>(VehicleService);
    ratingService = module.get<RatingService>(RatingService);

    // create users for testing
    await userController.postUser(new MockCreateUser(true, 0));
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
    providerForThisTest = await userService.getUserById(1);
    await vehicleService.creatingVehicle(1, new MockVehicle(1));

    await userController.postUser(new MockCreateUser(false, 1));
    userForThisTest = await userService.getUserById(2);
    await vehicleService.creatingVehicle(2, new MockVehicle(2));
  };

  const deleteDbMock = async () => {
    fs.unlink('./db/tmp.tester.offer.controller.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  };
});
