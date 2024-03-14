import { TripRequestOffering } from "../../../interfaces/TripRequestOffering.ts";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { acceptOffering, deleteOffering, getOfferings } from '../../../services/tripRequestService.ts';
import { reqAndOffStore } from './offeringsAndRequests-zustand.ts';

function OfferingListItem(
  props: {
    offering: TripRequestOffering,
    receiver?: boolean
  }
) {

  const { setIncomingOfferings, setSentOfferings } = reqAndOffStore();

  const getOffs = async () => {
    const {incomingOfferings, sentOfferings} = await getOfferings();
    setIncomingOfferings(incomingOfferings);
    setSentOfferings(sentOfferings);
  }

  const sendAcceptOffering = async () => {
    const successful = await acceptOffering(props.offering.id);
    if (successful) {
      await getOffs()
      //Todo: hier kann man mal was machen
    }
  }

  const handleDelete = async () => {
    const successful = await deleteOffering(props.offering.id);
    if (successful) {
      await getOffs()
      //Todo: hier kann man mal was machen
    }
  }



  return (
    <>
      <Row className='align-items-center mb-2'>
        <Col>
          {!props.receiver ?
            <h4>Von: {props.offering.tripRequest?.requester?.firstName} {props.offering.tripRequest?.requester?.lastName}</h4>
            :
            <h4>An: {props.offering.offeringUser?.firstName} {props.offering.offeringUser?.lastName}</h4>
          }
          <h5>Preisvorschlag: {props.offering.requestedCoins} Coins</h5>
          {props.receiver ?
            <h5>Angefragte Sitze: {props.offering.tripRequest.seats}</h5>
            :
            <h5>Beanspruchte Sitze: {props.offering.tripRequest.seats}</h5>
          }
        </Col>
        <Col>
          {props.receiver ?
            <>
              <Button onClick={sendAcceptOffering} className='mainButton w-75 mb-2'>Annehmen</Button>
              <Button className='mainButton w-75 mb-2'>Ablehnen</Button>
            </>
            :
            <>
              <Button className='mainButton w-75 mb-2'>Bearbeiten</Button>
              <Button onClick={handleDelete} className='mainButton w-75 mb-2'>Löschen</Button>
            </>
          }
        </Col>
      </Row>
      <Row>
        <h5>Nachricht:</h5>
        <p>{props.offering.text} </p>
      </Row>

    </>
  );
}

export default OfferingListItem;