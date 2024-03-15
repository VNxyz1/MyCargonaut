import React, { useState, useEffect } from "react";
import {Modal, ModalProps} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";


interface CreateCargoModalComponent extends ModalProps {
    onHide: () => void;
}


const CreateCargoModalComponent: React.FC<CreateCargoModalComponent> = (props: CreateCargoModalComponent) => {
    const [startPlzValue, setStartPlzValue] = useState<string>('');
    const [endPlzValue, setEndPlzValue] = useState<string>('');
    const [startLocationValue, setStartLocationValue] = useState<string>('');
    const [endLocationValue, setEndLocationValue] = useState<string>('');
    const [dateValue, setDateValue] = useState<string>('');
    const [imageValue, setImageValue] = useState<string>('');
    const [seatValue, setSeatValue] = useState<number>(0);
    const [descriptionValue, setDescriptionValue] = useState<string>('');

    useEffect(() => {

    }, []);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        
        try {
            const response = await fetch('/request', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    "startPlz": {
                        "plz": startPlzValue,
                        "location": startLocationValue
                    },
                    "endPlz": {
                        "plz": endPlzValue,
                        "location": endLocationValue
                    },
                    "cargoImg": {imageValue},
                    "description": descriptionValue,
                    "startDate": dateValue,
                    "seats": seatValue
                }),
            });    
            
            console.log(JSON.stringify({
                "startPlz": {
                    "plz": startPlzValue,
                    "location": startLocationValue
                },
                "endPlz": {
                    "plz": endPlzValue,
                    "location": endLocationValue
                },
                "cargoImg": {imageValue},
                "description": descriptionValue,
                "startDate": dateValue,
                "seats": seatValue
            }))

            if (response.ok) {
                console.log('Anfrage erfolgreich gesendet');
            } else {
                console.error('Fehler bei der Anfrage an das Backend');
            }
        } catch (error) {
            console.error('Fehler beim Senden der Anfrage:', error);
        }
        

        props.onHide();
    };


    return (
        <Modal
            {...props}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    CARGO ANLEGEN
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <span>Start:</span>
                        <Form.Group as={Col} className="mb-3" controlId="plz">
                            <Form.Control
                                type="text"
                                onChange={(e) => setStartPlzValue(e.target.value)}
                                placeholder="Postleitzahl"/>
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3" controlId="location">
                            <Form.Control
                                type="text"
                                onChange={(e) => setStartLocationValue(e.target.value)}
                                placeholder="Standort"/>
                        </Form.Group>
                    </Row>
                    <Row>
                        <span>Ziel:</span>
                        <Form.Group as={Col} className="mb-3" controlId="plz">
                            <Form.Control
                                type="text"
                                onChange={(e) => setEndPlzValue(e.target.value)}
                                placeholder="Postleitzahl"/>
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3" controlId="location">
                            <Form.Control
                                type="text"
                                onChange={(e) => setEndLocationValue(e.target.value)}
                                placeholder="Standort"/>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col} className="mb-3" controlId="date">
                            <Form.Control
                                required
                                type="date"
                                onChange={(e) => setDateValue(e.target.value)}
                                placeholder="Datum"/>
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3" controlId="imageUpload">
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageValue(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col} xs={3} className="mb-3" controlId="vehicleSeatNumber">
                            <Form.Control
                                required
                                type="number"
                                step={1}
                                min={1}
                                max={20}
                                placeholder="Sitzplätze"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeatValue(parseInt(e.target.value))}
                                />
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3" controlId="registerEmail">
                        <Form.Control as="textarea" rows={3} placeholder="Beschreibung" onChange={(e) => setDescriptionValue(e.target.value)}/>
                    </Form.Group>

                    <Row>
                        <Col xs={12} md="auto" className="text-end d-flex align-items-end justify-content-end">
                            <Button type="submit" className="mainButton">Cargo anlegen</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateCargoModalComponent;
