import { TransitRequest } from "../../../interfaces/TransitRequest.ts";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {
  acceptTransitRequest,
  declineTransitRequest,
  deleteTransitRequest,
  getTransitRequests,
} from '../../../services/offerService.tsx';
import { reqAndOffStore } from './offeringsAndRequests-zustand.ts';
import { Offer } from '../../../interfaces/Offer.ts';


function TransitRequestListItem (
  props: {
    transitRequest: TransitRequest,
    closeModal?: () => void,
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
      await getTRs();
      if(props.closeModal) {
        props.closeModal()
      }
    }
  }


  const handleAccept = async () => {
    const successful = await acceptTransitRequest(Number(props.transitRequest.id));
    if (successful) {
      await getTRs()
      if(props.closeModal) {
        props.closeModal()
      }
    }
  }

  const handleDecline = async () => {
    const successful = await declineTransitRequest(Number(props.transitRequest.id));
    if (successful) {
      await getTRs();
      if (props.closeModal) {
        props.closeModal();
      }
    }
  };

  const displayRouteText = (offer: Offer|undefined) => {
    if (offer) {
      const rp1 = offer.route.find((rp)=> rp.position == 1);
      const rp2 = offer.route.find((rp)=> rp.position == offer.route.length);
      if (rp1 && rp2) {
        console.log(rp1, rp2)
        return `Auf der Fahrt von ${rp1.plz.location} nach ${rp2.plz.location}`;
      }
    }
    return'';
  }

  return (
    <>
      <Row className='align-items-center justify-content-between mb-2'>
        <Col xs={'auto'}>
          {!props.receiver ?
            <h4>An: {props.transitRequest.offer?.provider?.firstName} {props.transitRequest.offer?.provider?.lastName}</h4>
            :
            <h4>Von: {props.transitRequest.requester?.firstName} {props.transitRequest.requester?.lastName}</h4>
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
              <Button onClick={handleDecline} className='mainButton w-100 mb-2'>Ablehnen</Button>
            </>
            :
            <>
              <Button className='mainButton w-100 mb-2'>Bearbeiten</Button>
              <Button onClick={handleDelete} className='mainButton w-100 mb-2'>Löschen</Button>
            </>
          }
        </Col>
      </Row>
      <Row className='mb-2'>
        <span>{displayRouteText(props.transitRequest.offer)}</span>
      </Row>
      <Row>
        <h5>Nachricht:</h5>
        <p style={{wordWrap: 'break-word'}}>{props.transitRequest.text} </p>
      </Row>
    </>
  );
}

export default TransitRequestListItem;