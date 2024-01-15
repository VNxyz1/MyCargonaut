import ListGroup from "react-bootstrap/ListGroup";
import { TransitRequest } from "../../../interfaces/TransitRequest.ts";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { acceptTransitRequest, deleteTransitRequest } from "../../../services/offerService.ts";

function TransitRequestListItem (
  props: {
    transitRequest: TransitRequest,
    reRender: ()=>void,
    receiver?: boolean
  }
) {


  const handleDelete = async () => {
    const successful = await deleteTransitRequest(Number(props.transitRequest.id));
    if (successful) {
      props.reRender()
      //Todo: hier kann man mal was machen
    }
  }


  const handleAccept = async () => {
    const successful = await acceptTransitRequest(Number(props.transitRequest.id));
    if (successful) {
      props.reRender()
      //Todo: hier kann man mal was machen
    }
  }

  return (
    <ListGroup.Item>
      <Row>
        <Col>
          {!props.receiver ?
            <h4>{props.transitRequest.offer?.provider?.firstName} {props.transitRequest.offer?.provider?.lastName}</h4>
            :
            <h4>{props.transitRequest.requester?.firstName} {props.transitRequest.requester?.lastName}</h4>
          }
          <h5>Preisvorschlag: {props.transitRequest.offeredCoins}</h5>
          {props.receiver ?
            <h5>Angefragte Sitze: {props.transitRequest.requestedSeats}</h5>
            :
            <h5>Beanspruchte Sitze: {props.transitRequest.requestedSeats}</h5>
          }
          <p>Nachricht: {props.transitRequest.text} </p>
        </Col>
        <Col>
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

    </ListGroup.Item>
  );
}
export default TransitRequestListItem