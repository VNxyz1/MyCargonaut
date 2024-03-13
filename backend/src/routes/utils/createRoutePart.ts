import { Offer } from '../../database/Offer';
import { Plz } from '../../database/Plz';
import { RoutePart } from '../../database/RoutePart';

/**
 *  Does not post the RoutePart to the Database. It has to be done separately!
 */
export async function createRoutePart(offer: Offer, plz: Plz, position: number) {
  const routePart = new RoutePart();
  routePart.plz = plz;
  routePart.position = position;
  routePart.offer = offer;
  return routePart;
}
