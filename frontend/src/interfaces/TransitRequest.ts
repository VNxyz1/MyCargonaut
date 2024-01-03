import {User} from "./User.ts";
import {Offer} from "./Offer.ts";

export interface TransitRequest {

  id: number;

  offeredCoins: number;

  requestedSeats: number;

  text: string

  requester: User;

  offer: Offer;
}
