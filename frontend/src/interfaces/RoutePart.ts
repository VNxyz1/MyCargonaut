import {Offer} from "./Offer.ts";
import {Plz} from "./Plz.ts";

export interface RoutePart {

  id: number;

  plz: Plz;

  offer: Offer;

  position: number;
}
