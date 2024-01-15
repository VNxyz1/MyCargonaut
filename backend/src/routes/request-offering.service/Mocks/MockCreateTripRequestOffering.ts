import { User } from '../../../database/User';
import { TripRequest } from '../../../database/TripRequest';

export class MockCreateTripRequestOffering {
  id: number;
  requestedCoins: number;
  text: string;
  accepted: boolean;
  offeringUser: User;
  tripRequest: TripRequest;
}
