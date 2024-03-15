import React, { useState, useEffect } from "react";
import {Modal, ModalProps} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { Vehicle } from "../../../interfaces/Vehicle";
import { useAuth } from "../../../services/authService";
import { User } from "../../../interfaces/User";
import { getOwnVehicles } from "../../../services/vehicleService";

interface Route {
    plz: string;
    location: string;
    position: number;
  }

interface CreateTripModalComponent extends ModalProps {
    onHide: () => void;
    userData: User | null;
}


const CreateTripModalComponent: React.FC<CreateTripModalComponent> = (props: CreateTripModalComponent) => {
    const [plzValue, setPlzValue] = useState<string>('');
    const [locationValue, setLocationValue] = useState<string>('');
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>();
    const [descriptionValue, setDescription] = useState<string>('');
    const [dateValue, setDateValue] = useState<string>('');
    const [seatNumberValue, setSeatNumberValue] = useState<number>(0);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        if (!props.show) {
            setRoutes([]);
        }
        if (isAuthenticated && props.userData) {
            fetchVehicle();
        }
    }, [isAuthenticated && props.show && props.userData]);

    const fetchVehicle = async () => {
        try {
            const data = await getOwnVehicles();
            if (data !== null) {
                setVehicles(data as any);
            }
        } catch (error) {
            console.error("Error fetching vehicle data", error);
        }
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        
        try {
            const response = await fetch('/offer', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    route: routes,
                    vehicleId: selectedVehicle?.id,
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
                    <div className="mb-3" style={{ maxHeight: '200px', overflowX: 'hidden' }}>
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
                                type="date"
                                onChange={(e) => setDateValue(e.target.value)}
                                placeholder="Datum"/>
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3" controlId="vehicle">
                        <Form.Select
                            required
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedVehicle(vehicles.filter((vehicle: { name: string; }) => vehicle.name === e.target.value)[0])}
                            value={selectedVehicle?.name}
                        >
                            <option value="">Fahrzeug</option>
                            {vehicles.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.name}>{vehicle.name}</option>
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
                        <Form.Control onChange={(e)=> setDescription(e.target.value)} as="textarea" rows={3} placeholder="Beschreibung"/>
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
