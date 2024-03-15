import { TransitRequest } from "../../../interfaces/TransitRequest.ts";
import { Col, Modal, Row } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import {
  acceptTransitRequest,
  declineTransitRequest,
  deleteTransitRequest,
  getTransitRequests, updateTransitRequest, UpdateTransitRequestData,
} from '../../../services/offerService.tsx';
import { reqAndOffStore } from './offeringsAndRequests-zustand.ts';
import { Offer } from '../../../interfaces/Offer.ts';
import Form from 'react-bootstrap/Form';
import React, { useEffect, useState } from 'react';


function TransitRequestListItem (
  props: {
    transitRequest: TransitRequest,
    closeModal?: () => void,
    receiver?: boolean
  }
) {
  const { setSentTransitRequests, setIncomingTransitRequests} = reqAndOffStore();

  const [ showModal, setShowModal ] = useState<boolean>(false);
  const [ updateParams, setUpdateParams ] = useState<UpdateTransitRequestData>({
    offeredCoins: 0,
    requestedSeats: 0,
    text: ''
  });

  useEffect(() => {
    resetUpdateParams();
  }, [props.transitRequest]);

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
    if (data.offeredCoins == undefined || data.offeredCoins.toString() == '') {
      data.offeredCoins = 0;
    }
    data.offeredCoins = Number(data.offeredCoins)

    if (data.requestedSeats == undefined || data.requestedSeats.toString() == '') {
      data.requestedSeats = 0;
    }
    data.requestedSeats = Number(data.requestedSeats)

    const success = await updateTransitRequest(Number(props.transitRequest.offer?.id), updateParams);
    if (success) {
      handleCloseModal();
      await getTRs();
    }
  }
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
      offeredCoins: props.transitRequest.offeredCoins,
      requestedSeats: props.transitRequest.requestedSeats,
      text: props.transitRequest.text
    })
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
              <Button onClick={handleOpenModal} className='mainButton w-100 mb-2'>Bearbeiten</Button>
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

      <Modal centered show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton />
        <Modal.Body>
          <Form onSubmit={handleUpdateData}>
            <Form.Group className="mb-3">
              <Form.Label>Coins</Form.Label>
              <Form.Control required min={0} type="number" aria-label='offeredCoins' onChange={handleChangeUpdateParams} value={updateParams.offeredCoins}/>
              <Form.Text className="text-muted">
                Passe an wie viele Coins du für die Fahrt zahlen möchtest
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sitze</Form.Label>
              <Form.Control required min={0} type="number" aria-label='requestedSeats' onChange={handleChangeUpdateParams} value={updateParams.requestedSeats}/>
              <Form.Text className="text-muted">
                Passe an wie viele Sitze du für die Fahrt beanspruchst
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

export default TransitRequestListItem;