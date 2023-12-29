import {OfferService} from "./offer.service";
import {User} from "../../database/User";
import {Offer} from "../../database/Offer";
import {Plz} from "../../database/Plz";
import {TransitRequest} from "../../database/TransitRequest";
import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as fs from "fs";
import {MockCreateOffer} from "./Mock/MockCreateOffer";
import {CreateOfferDto} from "../offer/DTOs/CreateOfferDto";
import {UserService} from "../user.service/user.service";
import {MockCreateUser} from "../user/Mocks/MockCreateUser";
import {MockPostOfferReturnVal} from "./Mock/MockPostOfferReturnVal";
import {CreatePlzDto} from "../offer/DTOs/CreatePlzDto";
import {UpdateOfferRequestDto} from "../offer/DTOs/UpdateOfferRequestDto";
import {MockGetOffer} from "./Mock/MockGetOffer";

describe('OfferService', () => {
  let offerService: OfferService;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './db/tmp.tester.offer.service.sqlite',
          entities: [User, Offer, Plz, TransitRequest],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Offer, Plz, TransitRequest]),
      ],
      providers: [
        OfferService,
        UserService
      ],
    }).compile();

    offerService = module.get<OfferService>(OfferService);
    userService = module.get<UserService>(UserService);

    await userService.postUser(new MockCreateUser(true));

  });

  it('should be defined', () => {
    expect(offerService).toBeDefined();
  });

  describe('postOffer', () => {
    it('should post an offer with route', async () => {
      const providerId = 1;
      const offerDto: CreateOfferDto = new MockCreateOffer();



      expect(await offerService.postOffer(providerId, offerDto)).toEqual(new MockPostOfferReturnVal());
    });
  });

  describe('checkIfPlzIsDuplicate', () => {
    it('should check if PLZ is duplicate and return the Plz object', async () => {
      const plzDto: CreatePlzDto = {
        plz: "12345"
      };

      const duplicatePlz = await offerService.checkIfPlzIsDuplicate(plzDto);

      expect(duplicatePlz).toBeDefined();
    });

    it('should return null if PLZ is not duplicate', async () => {
      const plzDto: CreatePlzDto = {
        plz: "54321"
      };

      const duplicatePlz = await offerService.checkIfPlzIsDuplicate(plzDto);

      expect(duplicatePlz).toBeNull();
    });
  });

  describe('getOffers', () => {
    it('should get offers with search criteria', async () => {
      const secondOffer = new MockCreateOffer();
      secondOffer.description = "Testiii und so";
      const searchFor = 'Testiii';

      await offerService.postOffer(1, secondOffer)

      const offers = await offerService.getOffers(searchFor);

      const resMock = new MockGetOffer();
      resMock.description = "Testiii und so";
      resMock.id = 2;
      expect(offers[0]).toEqual(resMock)
    });

    it('should get all offers if no search criteria provided', async () => {

      const offers = await offerService.getOffers();

      expect(offers[0]).toEqual(new MockGetOffer())
    });
  });

  describe('getOffersOfUser', () => {
    it('should get offers of a specific user', async () => {
      const userId = 1;

      const offers = await offerService.getOffersOfUser(userId);

      // Add assertions to check if the returned offers belong to the specified user
    });
  });

  describe('getOffer', () => {
    it('should get a specific offer', async () => {
      const offerId = 1;

      const offer = await offerService.getOffer(offerId);

      // Add assertions to check if the returned offer is the correct one
    });

    it('should throw an exception if the offer does not exist', async () => {
      const nonExistingOfferId = 999;

      // Ensure there is no offer with the specified ID in the database

      await expect(offerService.getOffer(nonExistingOfferId)).rejects.toThrowError();
    });
  });

  describe('updateOffer', () => {
    it('should update an offer with new data', async () => {
      const updateData: UpdateOfferRequestDto = {
        // Provide necessary data for UpdateOfferRequestDto
      };
      const offerId = 1;

      const offer = await offerService.getOffer(offerId);

      await offerService.updateOffer(updateData, offer);

      // Add assertions to check if the offer has been updated successfully
    });
  });

  describe('deleteOffer', () => {
    it('should delete an offer and related data', async () => {
      const offerId = 1;

      const offer = await offerService.getOffer(offerId);

      await offerService.deleteOffer(offer);

      // Add assertions to check if the offer and related data have been deleted successfully
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