import React, { useState, useEffect } from 'react';
import { Modal, ModalProps } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { postRequest, PostRequestBody } from '../../../services/tripRequestService.ts';

interface CreateCargoModalComponent extends ModalProps {
  onHide: () => void;
}


const CreateCargoModalComponent: React.FC<CreateCargoModalComponent> = (props: CreateCargoModalComponent) => {
  const [feedback, setFeedback] = useState<string | undefined>(undefined);
  const [postData, setPostData] = useState<PostRequestBody>({
    cargoImg: undefined,
    description: '',
    endPlz: {
      plz: '',
      location: '',
    },
    seats: 0,
    startDate: '',
    startPlz: {
      plz: '',
      location: '',
    },
  });

  useEffect(() => {
    console.log(postData)
  }, [postData]);

  useEffect(() => {
    if (props.show) {
      setFeedback(undefined);
      setPostData({
        cargoImg: undefined,
        description: '',
        endPlz: {
          plz: '',
          location: '',
        },
        seats: 0,
        startDate: '',
        startPlz: {
          plz: '',
          location: '',
        },
      })
    }
  }, [props.show]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const success = await postRequest(postData);
    if (!success) {
      setFeedback('Überprüfe deine Eingaben.');
      return;
    }

    props.onHide();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.ariaLabel !== null) {
      const prop: string = event.target.ariaLabel;
      let value: string| number = event.target.value;
      if (prop === "seats") {
        if (prop.trim().length == 0) {
          value = 0;
        }
        value = Number(value)
      }
      setPostData((oldData) => {
        return {
          ...oldData,
          [prop]: value,
        };
      });
    }
  };

  const handleChangeStartPlz = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.ariaLabel !== null) {
      const prop: string = event.target.ariaLabel
      setPostData((oldData) => {
        return {
          ...oldData,
          startPlz: {
            ...oldData.startPlz,
            [prop]: event.target.value,
          },
        };
      });
    }
  };

  const handleChangeEndPlz = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.ariaLabel !== null) {
      const prop: string = event.target.ariaLabel
      setPostData((oldData) => {
        return {
          ...oldData,
          endPlz: {
            ...oldData.endPlz,
            [prop]: event.target.value,
          },
        };
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const file : File = event.target.files[0];
      setPostData((oldData) => {
        return {
          ...oldData,
          cargoImg: file,
        };
      });
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          GESUCH EINSTELLEN
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <h4>Von</h4>
            <Form.Group as={Col} controlId="start-plz">
              <Form.Control
                required
                type="text"
                aria-label='plz'
                onChange={handleChangeStartPlz}
                value={postData.startPlz.plz}
                placeholder="Postleitzahl" />
            </Form.Group>
            <Form.Group as={Col} controlId="start-location">
              <Form.Control
                required
                type="text"
                aria-label='location'
                onChange={handleChangeStartPlz}
                value={postData.startPlz.location}
                placeholder="Standort" />
            </Form.Group>
          </Row>
          <Row className="mb-4">
            <h4>Nach</h4>
            <Form.Group as={Col} controlId="end-plz">
              <Form.Control
                required
                type="text"
                aria-label='plz'
                onChange={handleChangeEndPlz}
                value={postData.endPlz.plz}
                placeholder="Postleitzahl" />
            </Form.Group>
            <Form.Group as={Col} controlId="end-location">
              <Form.Control
                required
                type="text"
                aria-label='location'
                onChange={handleChangeEndPlz}
                value={postData.endPlz.location}
                placeholder="Standort" />
            </Form.Group>
          </Row>
          <Row className="align-items-end" >
            <Form.Group as={Col} xs={12} sm={4} className='mb-3' controlId="date">
              <Form.Label>
                Wann soll es los gehen?
              </Form.Label>
              <Form.Control
                required
                aria-label='startDate'
                onChange={handleChange}
                type="date"
                placeholder="Datum" />
            </Form.Group>
            <Form.Group as={Col} xs={12} sm={5} className='mb-3' controlId="formFile">
              <Form.Label>
                Bild (optional)
              </Form.Label>
              <Form.Control  type="file" onChange={handleFileChange} placeholder='Füge ein Bild des zu transportierenden Guts hinzu (optional)' />
            </Form.Group>
            <Form.Group as={Col} xs={12} sm={3} className='mb-3' controlId="vehicleSeatNumber">
              <Form.Label>
                (optional)
              </Form.Label>
              <Form.Control
                type="number"
                aria-label='seats'
                onChange={handleChange}
                step={1}
                min={0}
                max={20}
                placeholder="Sitzplätze" />
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" controlId="description">
            <Form.Control
              required
              as="textarea"
              aria-label='description'
              onChange={handleChange}
              value={postData.description}
              rows={3}
              placeholder="Beschreibung" />
          </Form.Group>

          <Row className="justify-content-end">
            {!feedback ?
              <></>
              :
              <Col>
                <Form.Text style={{ color: 'red' }}>
                  {feedback}
                </Form.Text>
              </Col>
            }
            <Col xs="auto">
              <Button type="submit" className="mainButton">Fahrt anlegen</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateCargoModalComponent;
