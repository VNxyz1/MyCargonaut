import { TripRequestOffering } from '../../../interfaces/TripRequestOffering.ts';
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { acceptOffering, declineOffering, deleteOffering, getOfferings } from '../../../services/tripRequestService.ts';
import { reqAndOffStore } from './offeringsAndRequests-zustand.ts';
import { TripRequest } from '../../../interfaces/TripRequest.ts';

function OfferingListItem(
  props: {
    offering: TripRequestOffering,
    closeModal?: () => void
    receiver?: boolean
  },
) {

  const { setIncomingOfferings, setSentOfferings } = reqAndOffStore();

  const getOffs = async () => {
    const { incomingOfferings, sentOfferings } = await getOfferings();
    setIncomingOfferings(incomingOfferings);
    setSentOfferings(sentOfferings);
  };

  const sendAcceptOffering = async () => {
    const successful = await acceptOffering(props.offering.id);
    if (successful) {
      await getOffs();
      if (props.closeModal) {
        props.closeModal();
      }
    }
  };

  const handleDelete = async () => {
    const successful = await deleteOffering(props.offering.id);
    if (successful) {
      await getOffs();
      if (props.closeModal) {
        props.closeModal();
      }
    }
  };

  const handleDecline = async () => {
    const successful = await declineOffering(props.offering.id);
    if (successful) {
      await getOffs();
      if (props.closeModal) {
        props.closeModal();
      }
    }
  };

  const displayRouteText = (tR: TripRequest) => {
    if (tR) {
      return `Auf der Fahrt von ${tR.startPlz.location} nach ${tR.endPlz.location}`;
    }
    return '';
  };


  return (
    <>
      <Row className="align-items-center justify-content-between mb-2">
        <Col xs={'auto'}>
          {!props.receiver ?
            <h4>An: {props.offering.tripRequest?.requester?.firstName} {props.offering.tripRequest?.requester?.lastName}</h4>
            :
            <h4>Von: {props.offering.offeringUser?.firstName} {props.offering.offeringUser?.lastName}</h4>
          }
          <h5>Preisvorschlag: {props.offering.requestedCoins} Coins</h5>
          {props.receiver ?
            <h5>Angefragte Sitze: {props.offering.tripRequest.seats}</h5>
            :
            <h5>Beanspruchte Sitze: {props.offering.tripRequest.seats}</h5>
          }
        </Col>
        <Col style={{ maxWidth: 'min-content' }}>
          {props.receiver ?
            <>
              <Button onClick={sendAcceptOffering} className="mainButton w-100 mb-2">Annehmen</Button>
              <Button onClick={handleDecline} className="mainButton w-100 mb-2">Ablehnen</Button>
            </>
            :
            <>
              <Button className="mainButton w-100 mb-2">Bearbeiten</Button>
              <Button onClick={handleDelete} className="mainButton w-100 mb-2">Löschen</Button>
            </>
          }
        </Col>
      </Row>
      <Row className="mb-2">
        <span>{displayRouteText(props.offering.tripRequest)}</span>
      </Row>
      <Row>
        <h5>Nachricht:</h5>
        <p style={{wordWrap: 'break-word'}}>{props.offering.text} </p>
      </Row>
    </>
  );
}

export default OfferingListItem;