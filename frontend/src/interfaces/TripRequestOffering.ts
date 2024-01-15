import { UserLight } from "./UserLight.ts";
import { TripRequest } from "./TripRequest.ts";

export interface TripRequestOffering {
  id: number;
  requestedCoins: number;
  text: string;
  offeringUser: UserLight;
  tripRequest: TripRequest;
  accepted: boolean;
}