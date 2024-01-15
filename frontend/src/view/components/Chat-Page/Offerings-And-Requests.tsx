import { useEffect, useState } from "react";
import { getOfferings } from "../../../services/tripRequestService.ts";
import { TripRequestOffering } from "../../../interfaces/TripRequestOffering.ts";
import { getTransitRequests } from "../../../services/offerService.ts";
import { TransitRequest } from "../../../interfaces/TransitRequest.ts";
import TransitRequestListItem from "./TransitRequestListItem.tsx";
import OfferingListItem from "./OfferingListItem.tsx";
import ListGroup from "react-bootstrap/ListGroup";
import { Col, Row } from "react-bootstrap";

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
    (async () => {
      await getResources()
    })()

  }, []);

  const getResources = async () => {
    const offerings: SentAndIncomingOfferings = await getOfferings();
    setOfferings(offerings);

    const transitRequests: SentAndIncomingTransitRequests = await getTransitRequests();
    setTransitRequests(transitRequests);
  }
  

  return (
    <>
      <Row>
        <Col>
          <ListGroup style={{borderRadius: '1rem'}}>
            <h3>Eingehende Anfragen:</h3>
            {offerings?.incomingOfferings.map((o) => (
              <OfferingListItem offering={o} reRender={getResources} receiver/>
            ))}
            {transitRequests?.incomingTransitRequests.map((tR) => (
              <TransitRequestListItem transitRequest={tR} reRender={getResources} receiver/>
            ))}
          </ListGroup>
        </Col>
        <Col>
          <ListGroup>
            <h3>Versandte Anfragen:</h3>
            {offerings?.sentOfferings.map((o) => (
              <OfferingListItem offering={o} reRender={getResources}/>
            ))}
            {transitRequests?.sentTransitRequests.map((tR) => (
              <TransitRequestListItem transitRequest={tR} reRender={getResources}/>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
}

export default OfferingsAndRequests