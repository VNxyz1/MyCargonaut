import ListGroup from "react-bootstrap/ListGroup";
import { TripRequestOffering } from "../../../interfaces/TripRequestOffering.ts";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { acceptOffering, deleteOffering } from "../../../services/tripRequestService.ts";

function OfferingListItem(
  props: {
    offering: TripRequestOffering,
    reRender: ()=> void
    receiver?: boolean
  }
) {

  const sendAcceptOffering = async () => {
    const successful = await acceptOffering(props.offering.id);
    if (successful) {
      props.reRender()
      //Todo: hier kann man mal was machen
    }
  }

  const handleDelete = async () => {
    const successful = await deleteOffering(props.offering.id);
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
            <h4>{props.offering.tripRequest?.requester?.firstName} {props.offering.tripRequest?.requester?.lastName}</h4>
            :
            <h4>{props.offering.offeringUser?.firstName} {props.offering.offeringUser?.lastName}</h4>
          }
          <h5>Preisvorschlag: {props.offering.requestedCoins}</h5>
          {props.receiver ?
            <h5>Angefragte Sitze: {props.offering.tripRequest.seats}</h5>
            :
            <h5>Beanspruchte Sitze: {props.offering.tripRequest.seats}</h5>
          }
          <p>Nachricht: {props.offering.text} </p>
        </Col>
        <Col>
          {props.receiver ?
            <>
              <Button onClick={sendAcceptOffering} className='mainButton w-100 mb-2'>Annehmen</Button>
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

export default OfferingListItem