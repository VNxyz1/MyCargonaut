import { TransitRequest } from '../../../database/TransitRequest';
import { MockGetOffer } from '../../offer.service/Mock/MockGetOffer';
import { GetAverageRatingsDto } from '../../rating/DTOs/GetAverageRatingsResponseDTO';
import { GetUserRatingsDto } from '../../rating/DTOs/GetUserRatingsResponseDTO';

export class MockGetUser {
  id: number;

  eMail: string;

  firstName: string;

  lastName: string;

  password: string;

  birthday: Date;

  profilePicture?: string;

  phoneNumber?: string;

  description: string;

  entryDate: Date | string;

  coins: number;

  requestedTransits: TransitRequest[];

  offers?: MockGetOffer[];
  trips?: MockGetOffer[];

  averageRatings: GetAverageRatingsDto;
  totalRatings: GetUserRatingsDto;

  reservedCoins?: number;

  constructor(asProvider?: boolean, forService?: boolean) {
    this.id = 1;
    this.entryDate = new Date('2021-02-18');
    this.eMail = 'tester@test.com';
    this.firstName = 'Max';
    this.lastName = 'Mustermann';
    this.birthday = new Date('2002-02-18');
    this.description = 'Test';
    this.profilePicture = '';
    this.phoneNumber = '';
    this.coins = 500;
    this.requestedTransits = [];

    if (asProvider) {
      this.profilePicture = '/profile-pictures/12341.png';
      this.phoneNumber = '+49 173 55555';
    }

    if (forService) {
      this.offers = [];
      this.trips = [];
      this.entryDate = '2021-02-18';
      this.reservedCoins = 0;
    }
  }
}
