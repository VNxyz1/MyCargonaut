import { useEffect, useState } from "react";
import { getOfferings } from "../../../services/tripRequestService.ts";
import { TripRequestOffering } from "../../../interfaces/TripRequestOffering.ts";
import { getTransitRequests } from "../../../services/offerService.ts";
import { TransitRequest } from "../../../interfaces/TransitRequest.ts";

interface SentAndIncomingOfferings {
  incomingOfferings: TripRequestOffering[];
  sentOfferings: TripRequestOffering[];
}

interface SentAndIncomingTransitRequests {
  incomingTransitRequests: TransitRequest[];
  sentTransitRequests: TransitRequest[];
}
function OfferingsAndRequests() {
  const [offerings, setOfferings] = useState<SentAndIncomingOfferings>();
  const [transitRequests, setTransitRequests] = useState<SentAndIncomingTransitRequests>();


  useEffect(() => {
    (async ()=> {
      const offerings: SentAndIncomingOfferings = await getOfferings();
      setOfferings(offerings);

      const transitRequests: SentAndIncomingTransitRequests = await getTransitRequests();
      setTransitRequests(transitRequests);
    })()

  }, []);

  return (
    <>
      <h4>Eingehende Anfragen:</h4>
      {offerings?.incomingOfferings.map((o)=> (
        <>
          <p>Nutzer: {o.offeringUser.firstName} {o.offeringUser.lastName} hat da was für dich</p>
        </>
      ))}
      {transitRequests?.incomingTransitRequests.map((tR)=> (
        <>
          <p>Nutzer: {tR.requester?.firstName} {tR.requester?.lastName} hat da was für dich</p>
        </>
      ))}
      <h4>Versandte Anfragen:</h4>
      {offerings?.sentOfferings.map((o)=> (
        <>
          <p>Du hast da was für {o.tripRequest.provider.firstName} {o.tripRequest.provider.lastName} verschickt</p>
        </>
      ))}
      {transitRequests?.sentTransitRequests.map((tR)=> (
        <>
          <p>Du hast da was für {tR.offer?.provider.firstName} {tR.offer?.provider.lastName} verschickt</p>
        </>
      ))}
    </>
  );
}

export default OfferingsAndRequests