import { UserLight } from "./UserLight.ts";
import { Offer } from "./Offer.ts";

export interface TripRequestOffering {
  id: number;
  requestedCoins: number;
  text: string;
  offeringUser: UserLight;
  tripRequest: Offer;
  accepted: boolean;
}