import React, { useState } from 'react';
import { Modal, ModalProps } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

interface TripRequestOfferingModalProps extends ModalProps {
  onClose: () => void;
  requestId: number;
}

interface PostData {
  requestedCoins: number;
  text: string;
}
function TripRequestOfferingModal(props: TripRequestOfferingModalProps) {

  const [validated, setValidated] = useState(false);
  const [postData, setPostData] = useState<PostData>({
    requestedCoins: 0,
    text: '',
  });
  const [feedback, setFeedback] = useState<string | undefined>(undefined);


  const sendTransitRequest = async () => {
    try {
      const res: Response = await fetch(`/request/offering/${props.requestId}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(postData),
      });
      if (res.ok) {
        setValidated(true);
        props.onClose();
      } else {
        const data = await res.json();
        setFeedback(data.message);
      }
    } catch (e) {
      console.error(e)
    }

  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const prop = event.target.title;
    let value: string | number = event.target.value;
    if (prop === 'requestedCoins') {
      value = Number(value);
    }
    setPostData({
      ...postData,
      [prop]: value,
    });
  };

  return (
    <>
      <Modal {...props} centered>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={sendTransitRequest}>
            <Form.Group className="mb-3" controlId="transitModalForm.offeredCoins">
              <Form.Control
                required
                type="number"
                title="requestedCoins"
                placeholder="Coins"
                onChange={handleFormChange}
              />
              <Form.Text muted>
                Wie viele Coins verlangst du?
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="transitModalForm.text">
              <Form.Control
                as="textarea" rows={4}
                required
                type="text"
                title="text"
                placeholder="Nachricht"
                onChange={handleFormChange}
                aria-describedby="textHelpBlock"
              />
              <Form.Text id="textHelpBlock" muted>
                Möchtest du deinem potentiellen Mitfahrer noch etwas mitteilen?
              </Form.Text>
            </Form.Group>
            {!feedback ?
              <></>
              :
              <div>
                <Form.Text style={{ color: 'red' }}>
                  {feedback}
                </Form.Text>
              </div>
            }
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onClose}>
            Abbrechen
          </Button>
          <Button className="mainButton" type="submit" onClick={sendTransitRequest}>
            Angebot machen
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TripRequestOfferingModal;