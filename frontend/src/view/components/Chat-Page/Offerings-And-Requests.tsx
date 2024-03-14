import { reqAndOffStore } from './offeringsAndRequests-zustand.ts';
import { Card, Col, Row } from 'react-bootstrap';
import OfferingListItem from './OfferingListItem.tsx';
import TransitRequestListItem from './TransitRequestListItem.tsx';

function OfferingsAndRequests() {

  const { sentTransitRequests, sentOfferings } = reqAndOffStore();

  return (
    <>
      <Row>
          <h3>Versandte Anfragen:</h3>
          {sentOfferings.map((o) => (
            <Card as={Col} xs='auto' style={{maxWidth: '40rem', padding: '1rem'}}>
              <OfferingListItem offering={o} />
            </Card>
          ))}
          {sentTransitRequests.map((tR) => (
            <Card as={Col} xs='auto' style={{maxWidth: '40rem', padding: '1rem'}}>
              <TransitRequestListItem transitRequest={tR} />
            </Card>
          ))}
      </Row>
    </>
  );
}

export default OfferingsAndRequests;