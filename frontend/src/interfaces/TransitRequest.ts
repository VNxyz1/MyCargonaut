import {User} from "./User.ts";
import {Offer} from "./Offer.ts";

export interface TransitRequest {

  id: number;

  offeredCoins: number;

  requestedSeats: number;

  requester: User;

  offer: Offer;
}
