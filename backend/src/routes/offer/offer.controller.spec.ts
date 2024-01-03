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
import { InternalServerErrorException } from '@nestjs/common';

describe('OfferController', () => {
  let offerController: OfferController;
  let userController: UserController;
  let userService: UserService;
  let providerForThisTest: User;
  let userForThisTest: User;
  let session: ISession = new MockSession(true);

  beforeAll(async () => {
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

    // create users for testing
    await userController.postUser(new MockCreateUser(true, 0));
    providerForThisTest = await userService.getUserById(1);

    await userController.postUser(new MockCreateUser(false, 1));
    userForThisTest = await userService.getUserById(2);
  });

  it('should be defined', () => {
    expect(offerController).toBeDefined();
  });

  describe('get offers', () => {
    it('should create a new offer', async () => {
      runTestAsProvider();
      const result = await postNewOffer();

      expect(result).toEqual(
        new OKResponseWithMessageDTO(true, 'Offer Created'),
      );
    });

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

  describe('get filtered offers route', () => {
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

  afterAll(async () => {
    fs.unlink('./db/tmp.tester.offer.controller.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
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

  const postNewOffer = async () => {
    const createOfferDto = new MockPostOffer();
    return await offerController.postUser(createOfferDto, session);
  };
});
