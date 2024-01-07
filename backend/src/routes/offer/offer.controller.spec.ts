import { Test, TestingModule } from '@nestjs/testing';
import { OfferController } from './offer.controller';
import { AuthController } from '../auth/auth.controller';
import { User } from '../../database/User';
import { ISession } from '../../utils/ISession';
import { MockSession } from '../user/Mocks/MockSession';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '../../database/Offer';
import { Plz } from '../../database/Plz';
import { TransitRequest } from '../../database/TransitRequest';
import { RoutePart } from '../../database/RoutePart';
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
import {BadRequestException, InternalServerErrorException} from '@nestjs/common';
import {TripState} from "../../database/TripState";

describe('OfferController', () => {
  let offerController: OfferController;
  let offerService: OfferService;
  let userController: UserController;
  let userService: UserService;
  let providerForThisTest: User;
  let userForThisTest: User;
  let session: ISession = new MockSession(true);

  beforeAll(async () => {
    await setup();
  });

  it('should be defined', () => {
    expect(offerController).toBeDefined();
  });

  describe('post offers', () => {
    it('should create a new offer', async () => {
      runTestAsProvider();
      const result = await postNewOffer();

      expect(result).toEqual(
        new OKResponseWithMessageDTO(true, 'Offer Created'),
      );
    });

    it('should throw an error, because the user is not a provider', async () => {
      runTestAsClient();

      await expect(postNewOffer()).rejects.toThrow();
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
      const result = await offerController.updateOffer(
        session,
        offerId,
        updateOfferDto,
      );
      expect(result).toEqual(
        new OKResponseWithMessageDTO(true, 'Offer Updated'),
      );
    });

    it('should throw BadRequestException when updating offer with different provider', async () => {
      runTestAsClient();
      const offerId = 1;
      const updateOfferDto = new MockUpdateOffer();

      await expect(
        offerController.updateOffer(session, offerId, updateOfferDto),
      ).rejects.toThrow('You are not the Provider of this Offer!');
    });

    it('should throw BadRequestException when updating non-existing offer', async () => {
      runTestAsProvider();
      const nonExistingOfferId = 999;
      const updateOfferDto = new MockUpdateOffer();

      await expect(
        offerController.updateOffer(
          session,
          nonExistingOfferId,
          updateOfferDto,
        ),
      ).rejects.toThrow(
        new InternalServerErrorException('Offer was not found!'),
      );
    });
  });

  describe('delete route', () => {
    it('should delete the offer', async () => {
      runTestAsProvider();
      const offerId = 1;
      const result = await offerController.deleteOffer(session, offerId);
      expect(result).toEqual(
        new OKResponseWithMessageDTO(true, 'Offer Deleted'),
      );
    });

    it('should throw BadRequestException when deleting offer with different provider', async () => {
      runTestAsProvider();
      await postNewOffer();

      runTestAsClient();
      const offerId = 2;

      await expect(
        offerController.deleteOffer(session, offerId),
      ).rejects.toThrow('You are not the Provider of this Offer!');
    });
    it('should throw BadRequestException when deleting non-existing offer', async () => {
      runTestAsProvider();
      const nonExistingOfferId = 999;

      await expect(
        offerController.deleteOffer(session, nonExistingOfferId),
      ).rejects.toThrow(
        new InternalServerErrorException('Offer was not found!'),
      );
    });

    it('should throw BadRequestException when deleting offer with invalid id', async () => {
      runTestAsProvider();
      const invalidOfferId = 'invalid';

      await expect(
        offerController.deleteOffer(session, Number(invalidOfferId)),
      ).rejects.toThrow('SQLITE_ERROR: no such column: NaN');
    });
  });


  describe('set offer as booked up route', () => {
    it('should reject the request', async () => {
      runTestAsProvider();
      await postNewOffer();

      runTestAsClient();
      const offerId = 3;

      await expect(offerController.setOfferAsBookedUp(session, offerId))
          .rejects
          .toThrow(new BadRequestException('You are not the Provider of this Offer!'))
    });

    it('should set the offer as booked up', async () => {
      runTestAsProvider();

      const offerId = 3;

      await expect(offerController.setOfferAsBookedUp(session, offerId))
          .resolves
          .toEqual(new OKResponseWithMessageDTO(true, 'Offer is set as booked up'));

      const offer = await offerService.getOffer(offerId);
      expect(offer.state).toBe(TripState.bookedUp);
    });
  });


  describe('reopen offer route', () => {
    it('should reject the request', async () => {
      runTestAsClient();
      const offerId = 3;

      await expect(offerController.reopenOffer(session, offerId))
          .rejects
          .toThrow(new BadRequestException('You are not the Provider of this Offer!'))
    });

    it('should reopen the offer', async () => {
      runTestAsProvider();

      const offerId = 3;

      await expect(offerController.reopenOffer(session, offerId))
          .resolves
          .toEqual(new OKResponseWithMessageDTO(true, 'Offer is reopened'));

      const offer = await offerService.getOffer(offerId);
      expect(offer.state).toBe(TripState.offer);
    });
  });


  describe('get filtered offers route', () => {


    it('should get filtered offers', async () => {

      await deleteDbMock();
      await setup();
      runTestAsProvider();
      await postNewOffer(true);
      await postNewOffer();

      runTestAsLoggedOutUser();
      const searchString = 'test';
      const result = await offerController.getFilteredOffers(searchString, "63679", "64002");
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(1);
      expect(
          result.offerList[0].description.toLowerCase().includes(searchString),
      ).toBe(true);
    });


    it('should return an empty list', async () => {
      runTestAsLoggedOutUser();
      const searchString = 'test';
      const result = await offerController.getFilteredOffers(undefined, "35390", "64002");
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(0);
    });

    it('should get filtered offers v2', async () => {
      runTestAsLoggedOutUser();
      const searchString = 'test';
      const result = await offerController.getFilteredOffers(undefined, "64002", "63679");
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(1);
    });

    it('should return an empty list', async () => {
      runTestAsLoggedOutUser();
      const searchString = 'test';
      const result = await offerController.getFilteredOffers(undefined, "64002", "64002");
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(0);
    });

    /*
    it('should get filtered offers', async () => {
      runTestAsLoggedOutUser();
      const searchString = 'test';
      const result = await offerController.getFilteredOffers(searchString);
      expect(result.offerList).toBeDefined();
      expect(
        result.offerList[0].description.toLowerCase().includes(searchString),
      ).toBe(true);
    });

    it('should return an empty list when no matching offers are found', async () => {
      runTestAsLoggedOutUser();
      const searchString = 'nonexistent';
      const result = await offerController.getFilteredOffers(searchString);
      expect(result.offerList).toBeDefined();
      expect(result.offerList.length).toBe(0);
    });


    it('should get offers that contain "Schotten" as location of a routePath', async () => {
      runTestAsClient();
      const result = await offerController.getFilteredOffers('Schotten');
      const filtered = result.offerList[0].route.find(
          (rP) => rP.plz.location === 'Schotten',
      );

      expect(result.offerList).toBeDefined();
      expect(filtered.plz.location).toBe('Schotten');
    });

    it('should get offers that contain "63679" as plz of a routePath', async () => {
      runTestAsClient();
      const result = await offerController.getFilteredOffers('63679');
      const filtered = result.offerList[0].route.find(
          (rP) => rP.plz.plz === '63679',
      );

      expect(result.offerList).toBeDefined();
      expect(filtered.plz.plz).toBe('63679');
    });
     */
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

  const postNewOffer = async (alt?: boolean) => {
    let createOfferDto: MockPostOffer;
    if(alt) {
      createOfferDto = new MockPostOffer(alt);
    } else {
      createOfferDto = new MockPostOffer();
    }
    return await offerController.postUser(createOfferDto, session);
  };


  const setup = async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './db/tmp.tester.offer.controller.sqlite',
          entities: [User, Offer, Plz, TransitRequest, RoutePart],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Offer, Plz, TransitRequest, RoutePart]),
      ],
      controllers: [UserController, AuthController, OfferController],
      providers: [UserService, AuthService, OfferService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    offerController = module.get<OfferController>(OfferController);
    offerService = module.get<OfferService>(OfferService);

    // create users for testing
    await userController.postUser(new MockCreateUser(true, 0));
    providerForThisTest = await userService.getUserById(1);

    await userController.postUser(new MockCreateUser(false, 1));
    userForThisTest = await userService.getUserById(2);
  }

  const deleteDbMock = async () => {
    fs.unlink('./db/tmp.tester.offer.controller.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  }
});
