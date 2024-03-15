import { TripRequestOffering } from '../../../../interfaces/TripRequestOffering.ts';
import { Col, Modal, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import {
  acceptOffering,
  declineOffering,
  deleteOffering,
  getOfferings, updateTripRequest,
  UpdateTripRequestData,
} from '../../../../services/tripRequestService.ts';
import { reqAndOffStore } from './offeringsAndRequests-zustand.ts';
import { TripRequest } from '../../../../interfaces/TripRequest.ts';
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';

function OfferingListItem(
  props: {
    offering: TripRequestOffering,
    closeModal?: () => void
    receiver?: boolean
  },
) {

  const { setIncomingOfferings, setSentOfferings } = reqAndOffStore();
  const [ showModal, setShowModal ] = useState<boolean>(false);
  const [ updateParams, setUpdateParams ] = useState<UpdateTripRequestData>({
    requestedCoins: 0,
    text: ''
  });

  useEffect(() => {
    resetUpdateParams();
  }, [props.offering]);


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

  const handleOpenModal = () => {
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    resetUpdateParams();
  }

  const handleUpdateData = async (event : React.FormEvent<HTMLFormElement>)=> {
    event.preventDefault();
    const data = updateParams;
    if (data.requestedCoins == undefined || data.requestedCoins.toString() == '') {
      data.requestedCoins = 0;
    }
    data.requestedCoins = Number(data.requestedCoins)

    const success = await updateTripRequest(props.offering.id, updateParams);
    if (success) {
      handleCloseModal();
      await getOffs();
    }
  }

  const displayRouteText = (tR: TripRequest) => {
    if (tR) {
      return `Auf der Fahrt von ${tR.startPlz.location} nach ${tR.endPlz.location}`;
    }
    return '';
  };

  const handleChangeUpdateParams = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.ariaLabel !== null) {
      const prop: string = event.target.ariaLabel;
      const value: string | number = event.target.value;
      setUpdateParams((oldData) => {
        return {
          ...oldData,
          [prop]: value,
        };
      });
    }
  };

  const resetUpdateParams = () => {
    setUpdateParams({
      requestedCoins: props.offering.requestedCoins,
      text: props.offering.text
    })
  }

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
              <Button onClick={handleOpenModal} className="mainButton w-100 mb-2">Bearbeiten</Button>
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


      <Modal centered show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton />
        <Modal.Body>
          <Form onSubmit={handleUpdateData}>
            <Form.Group className="mb-3">
              <Form.Label>Coins</Form.Label>
              <Form.Control required min={0} type="number" aria-label='requestedCoins' onChange={handleChangeUpdateParams} value={updateParams.requestedCoins}/>
              <Form.Text className="text-muted">
                Passe an wie viele Coins du für deine Anfrage verlangst
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nachricht</Form.Label>
              <Form.Control required as="textarea" type="text" aria-label='text' onChange={handleChangeUpdateParams} value={updateParams.text}/>
              <Form.Text className="text-muted">
                Was willst du noch los werden?
              </Form.Text>
            </Form.Group>
            <Row className='justify-content-end'>
              <Col xs='auto'>
                <Button type='submit' className='mainButton w-100'>Speichern</Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default OfferingListItem;