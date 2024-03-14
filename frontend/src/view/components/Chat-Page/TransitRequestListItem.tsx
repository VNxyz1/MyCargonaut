import { TransitRequest } from "../../../interfaces/TransitRequest.ts";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { acceptTransitRequest, deleteTransitRequest, getTransitRequests } from '../../../services/offerService.tsx';
import { reqAndOffStore } from './offeringsAndRequests-zustand.ts';


function TransitRequestListItem (
  props: {
    transitRequest: TransitRequest,
    receiver?: boolean
  }
) {
  const { setSentTransitRequests, setIncomingTransitRequests} = reqAndOffStore();

  const getTRs = async () => {

    const {incomingTransitRequests, sentTransitRequests} = await getTransitRequests();
    setIncomingTransitRequests(incomingTransitRequests);
    setSentTransitRequests(sentTransitRequests);
  }



  const handleDelete = async () => {
    const successful = await deleteTransitRequest(Number(props.transitRequest.id));
    if (successful) {
      await getTRs()
      //Todo: hier kann man mal was machen
    }
  }


  const handleAccept = async () => {
    const successful = await acceptTransitRequest(Number(props.transitRequest.id));
    if (successful) {
      await getTRs()
      //Todo: hier kann man mal was machen
    }
  }

  return (
    <>
      <Row className='align-items-center mb-2'>
        <Col xs={'auto'}>
          {!props.receiver ?
            <h4>Von: {props.transitRequest.offer?.provider?.firstName} {props.transitRequest.offer?.provider?.lastName}</h4>
            :
            <h4>An: {props.transitRequest.requester?.firstName} {props.transitRequest.requester?.lastName}</h4>
          }
          <h5>Preisvorschlag: {props.transitRequest.offeredCoins} Coins</h5>
          {props.receiver ?
            <h5>Angefragte Sitze: {props.transitRequest.requestedSeats}</h5>
            :
            <h5>Beanspruchte Sitze: {props.transitRequest.requestedSeats}</h5>
          }
        </Col>
        <Col  style={{maxWidth: 'min-content'}}>
          {props.receiver ?
            <>
              <Button onClick={handleAccept} className='mainButton w-100 mb-2'>Annehmen</Button>
              <Button className='mainButton w-100 mb-2'>Ablehnen</Button>
            </>
            :
            <>
              <Button className='mainButton w-100 mb-2'>Bearbeiten</Button>
              <Button onClick={handleDelete} className='mainButton w-100 mb-2'>Löschen</Button>
            </>
          }
        </Col>
      </Row>
      <Row>
        <h5>Nachricht:</h5>
        <p>{props.transitRequest.text} </p>
      </Row>
    </>
  );
}

export default TransitRequestListItem;