import React, { useState, useEffect } from "react";
import {Modal, ModalProps} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

interface Route {
    plz: string;
    location: string;
    position: number;
  }

interface CreateTripModalComponent extends ModalProps {
    onHide: () => void;
}

const vehicleList = [
    "PKW1",
    "PKW2",
    "PKW3"
];

const CreateTripModalComponent: React.FC<CreateTripModalComponent> = (props: CreateTripModalComponent) => {
    const [plzValue, setPlzValue] = useState<string>('');
    const [locationValue, setLocationValue] = useState<string>('');
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<string>('');
    const [descriptionValue] = useState<string>('');
    const [dateValue, setDateValue] = useState<string>('');
    const [seatNumberValue, setSeatNumberValue] = useState<number>(0);

    useEffect(() => {
        if (!props.show) {
            setRoutes([]);
        }
    }, [props.show]);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        
        try {
            const response = await fetch('/offer', {
                method: 'POST',
                body: JSON.stringify({
                    route: routes,
                    vehicle: selectedVehicle,
                    description: descriptionValue,
                    startDate: dateValue,
                    bookedSeats: seatNumberValue,
                }),
            });    
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

    const newRoute = (plz: string, location: string) => {
        if (plz.trim() !== '' && location.trim() !== '') {
            const newRoute: Route = {
                plz: plz,
                location: location,
                position: routes.length,
            };
    
            setRoutes([...routes, newRoute]);
            setPlzValue('');
            setLocationValue('');
        } else {
            alert('Bitte geben Sie sowohl PLZ als auch Standort ein, bevor Sie eine Route hinzufügen.');
        }
    };

    const removeRoute = (position: number) => {
        const updatedRoutes = routes.filter(route => route.position !== position);

        const reorderedRoutes = updatedRoutes.map((route, index) => ({
            ...route,
            position: index,
        }));

        setRoutes(reorderedRoutes);
    };

    return (
        <Modal
            {...props}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    FAHRT ANLEGEN
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Form.Group as={Col} className="mb-3" controlId="plz">
                            <Form.Control
                                type="text"
                                onChange={(e) => setPlzValue(e.target.value)}
                                value={plzValue}
                                placeholder="Postleitzahl"/>
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3" controlId="location">
                            <Form.Control
                                type="text"
                                onChange={(e) => setLocationValue(e.target.value)}
                                value={locationValue}
                                placeholder="Standort"/>
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3" controlId="addRoute">
                            <Button onClick={() => {                        
                                newRoute(plzValue, locationValue);
                                setPlzValue(''); 
                                setLocationValue('');
                                }} className="mainButton">+</Button>
                        </Form.Group>
                    </Row>
                    <div className="mb-3" style={{ height: '200px', overflowX: 'hidden' }}>
                        {routes.map((route, index) => (
                            <Row key={index}>
                                <Col>
                                    <p>{route.position}</p>
                                </Col>
                                <Col>
                                    <p><strong>PLZ:</strong> {route.plz}</p>
                                </Col>
                                <Col>
                                    <p><strong>Location:</strong> {route.location}</p>
                                </Col>
                                <Col>
                                    <Button onClick={() => removeRoute(route.position)} variant="danger">X</Button>
                                </Col>
                            </Row>
                        ))}
                    </div>
                    <Row>
                        <Form.Group as={Col} className="mb-3" controlId="date">
                            <Form.Control
                                required
                                type="text"
                                onChange={(e) => setDateValue(e.target.value)}
                                placeholder="Datum"/>
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3" controlId="vehicle">
                        <Form.Select
                            required
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedVehicle(e.target.value)}
                            value={selectedVehicle}
                        >
                            <option value="">Fahrzeugtyp</option>
                            {vehicleList.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} xs={3} className="mb-3" controlId="vehicleSeatNumber">
                            <Form.Control
                                required
                                type="number"
                                step={1}
                                min={1}
                                max={20}
                                placeholder="Sitzplätze"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeatNumberValue(parseInt(e.target.value))}
                                value={seatNumberValue}
                            />
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3" controlId="registerEmail">
                        <Form.Control as="textarea" rows={3} placeholder="Beschreibung (optional)"/>
                    </Form.Group>

                    <Row>
                        <Col xs={12} md="auto" className="text-end d-flex align-items-end justify-content-end">
                            <Button type="submit" className="mainButton">Fahrt anlegen</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateTripModalComponent;
