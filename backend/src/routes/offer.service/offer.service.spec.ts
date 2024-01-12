import { OfferService } from './offer.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { MockCreateOffer } from './Mock/MockCreateOffer';
import { CreateOfferDto } from '../offer/DTOs/CreateOfferDto';
import { UserService } from '../user.service/user.service';
import { MockCreateUser } from '../user/Mocks/MockCreateUser';
import { MockGetOffer } from './Mock/MockGetOffer';
import { InternalServerErrorException } from '@nestjs/common';
import { MockUpdateOffer } from './Mock/MockUpdateOffer';
import { TransitRequestService } from '../transit-request.service/transit-request.service';
import { entityArr, sqlite_setup } from '../../utils/sqlite_setup';

describe('OfferService', () => {
  let offerService: OfferService;
  let userService: UserService;
  let transitService: TransitRequestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        sqlite_setup('./db/tmp.tester.offer.service.sqlite'),
        TypeOrmModule.forFeature(entityArr),
      ],
      providers: [OfferService, UserService, TransitRequestService],
    }).compile();

    offerService = module.get<OfferService>(OfferService);
    userService = module.get<UserService>(UserService);
    transitService = module.get<TransitRequestService>(TransitRequestService);

    await userService.postUser(new MockCreateUser(true));
  });

  it('should be defined', () => {
    expect(offerService).toBeDefined();
  });

  describe('postOffer', () => {
    it('should post an offer with route', async () => {
      const providerId = 1;
      const offerDto: CreateOfferDto = new MockCreateOffer();

      await expect(
        offerService.postOffer(providerId, offerDto),
      ).resolves.toBeDefined();
    });
  });

  describe('checkIfPlzIsDuplicate', () => {
    it('should check if PLZ is duplicate and return the Plz object', async () => {
      const plz = '12345';
      const location = 'test';

      const duplicatePlz = await offerService.checkIfPlzIsDuplicate(
        plz,
        location,
      );

      expect(duplicatePlz).toBeDefined();
    });

    it('should return null if PLZ is not duplicate', async () => {
      const plz = '54321';
      const location = 'test';

      const duplicatePlz = await offerService.checkIfPlzIsDuplicate(
        plz,
        location,
      );

      expect(duplicatePlz).toBeNull();
    });
  });

  describe('getOffers', () => {
    it('should get offers with search criteria', async () => {
      const secondOffer = new MockCreateOffer();
      secondOffer.description = 'Testiii und so';
      const searchFor = 'Testiii';

      await offerService.postOffer(1, secondOffer);

      const offers = await offerService.getOffers(searchFor);

      const resMock = new MockGetOffer(true);
      resMock.description = 'Testiii und so';
      resMock.id = 2;
      expect(offers[0]).toEqual(resMock);
    });

    it('should get all offers if no search criteria provided', async () => {
      const offers = await offerService.getOffers();

      expect(offers[0]).toEqual(new MockGetOffer(false));
    });
  });

  describe('getOffersOfUser', () => {
    it('should get offers of a specific user', async () => {
      const userId = 1;

      const offers = await offerService.getOffersOfUser(userId);

      const filteredByUserId = offers.filter((o) => o.provider.id === userId);

      expect(filteredByUserId.length === offers.length).toBe(true);
    });
  });

  describe('getOffer', () => {
    it('should get a specific offer', async () => {
      const offerId = 1;

      const offer = await offerService.getOffer(offerId);

      expect(offer.id).not.toBeNull();
      expect(offer.id === offerId).toBe(true);
    });

    it('should throw an exception if the offer does not exist', async () => {
      const nonExistingOfferId = 999;

      await expect(offerService.getOffer(nonExistingOfferId)).rejects.toThrow(
        new InternalServerErrorException('Offer was not found!'),
      );
    });
  });

  describe('updateOffer', () => {
    it('should update an offer with a full set of new data', async () => {
      const updateData = new MockUpdateOffer();

      const offerId = 1;

      const offer = await offerService.getOffer(offerId);

      const test = await offerService.updateOffer(updateData, offer);

      const updatedOffer = await offerService.getOffer(offerId);

      expect(updatedOffer.description).toEqual(updateData.description);
      expect(updatedOffer.startDate).toEqual(updateData.startDate);
      expect(test.route[0].plz.plz).toEqual(updateData.route[0].plz);
    });
  });

  describe('deleteOffer', () => {
    it('should delete an offer and related data', async () => {
      const offerId = 1;

      const offer = await offerService.getOffer(offerId);

      await transitService.postTransitRequest(
        offer,
        await userService.getUserById(1),
        {
          requestedSeats: 2,
          offeredCoins: 200,
          text: 'Ich hab sonst nix dabei.',
        },
      );

      await offerService.deleteOffer(offer);

      await expect(offerService.getOffer(offerId)).rejects.toThrow();
    });
  });

  afterAll(async () => {
    fs.unlink('./db/tmp.tester.offer.service.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });
});
