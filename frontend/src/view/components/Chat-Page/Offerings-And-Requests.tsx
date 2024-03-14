import { reqAndOffStore } from './offeringsAndRequests-zustand.ts';
import { Card, Col, Container, Row } from 'react-bootstrap';
import OfferingListItem from './OfferingListItem.tsx';
import TransitRequestListItem from './TransitRequestListItem.tsx';

function OfferingsAndRequests() {

  const { sentTransitRequests, sentOfferings } = reqAndOffStore();

  return (
    <>
      <Row style={{columnGap: '20px', rowGap: '20px', justifyContent: 'space-between'}}>
        <h3>Versandte Anfragen:</h3>
        {sentOfferings.length == 0 && sentTransitRequests.length == 0 ?
          <Container className='text-center justify-content-center' style={{minHeight: '10rem'}}>
            <h3>Keine versandten Anfragen</h3>
          </Container>
          : <></>
        }
        {sentOfferings.map((o) => (
          <Card as={Col} xs="auto" style={{ maxWidth: '40rem', padding: '1rem' }}>
            <OfferingListItem offering={o} />
          </Card>
        ))}
        {sentTransitRequests.map((tR) => (
          <Card as={Col} xs="auto" style={{ maxWidth: '40rem', padding: '1rem' }}>
            <TransitRequestListItem transitRequest={tR} />
          </Card>
        ))}
      </Row>
    </>
  );
}

export default OfferingsAndRequests;