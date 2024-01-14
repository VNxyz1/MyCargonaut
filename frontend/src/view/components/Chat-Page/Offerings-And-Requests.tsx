import { useEffect, useState } from "react";
import { getOfferings } from "../../../services/tripRequestService.ts";
import { TripRequestOffering } from "../../../interfaces/TripRequestOffering.ts";

interface SentAndIncomingOfferings {
  incomingOfferings: TripRequestOffering[];
  sentOfferings: TripRequestOffering[];
}
function OfferingsAndRequests() {
  const [offerings, setOfferings] = useState<SentAndIncomingOfferings>();


  useEffect(() => {
    (async ()=> {
      const offerings: SentAndIncomingOfferings = await getOfferings();
      setOfferings(offerings)
    })()

  }, []);

  return (
    <>
      {offerings?.incomingOfferings.map((o)=> (
        <>
          <p>Nutzer: {o.offeringUser.firstName} {o.offeringUser.lastName} hat da was für dich</p>
        </>
      ))}
      {offerings?.sentOfferings.map((o)=> (
        <>
          <p>Du hast da was für {o.offeringUser.firstName} {o.offeringUser.lastName} verschickt</p>
        </>
      ))}
    </>
  );
}

export default OfferingsAndRequests