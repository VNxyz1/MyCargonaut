import React, { useState, useEffect } from "react";
import {Modal, Image, ModalProps} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import {createVehicle, uploadVehicleImage} from "../../../services/vehicleService.tsx";
import {CreateVehicleData} from "../../../interfaces/Vehicle.ts";

interface VehicleAddModalProps extends ModalProps {
    onHide: () => void;
}

const vehicleTypes = [
    "PKW",
    "LKW",
    "SUV",
    "Kleinwagen",
    "Kombi",
    "Cabriolet",
    "Coupé",
    "Geländewagen",
    "Van",
    "Minivan",
    "Sportwagen",
    "Limousine",
    "Nutzfahrzeug",
];

const VehicleAddModalComponent: React.FC<VehicleAddModalProps> = (props: VehicleAddModalProps) => {
    const [validated, setValidated] = useState<boolean>(false);
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!props.show) {
            setValidated(false);
            setImage(null);
            setPreviewUrl(null);
        }
    }, [props.show]);

    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);
        if (form.checkValidity()) {
            const formData: CreateVehicleData = {
                name: '',
                type: 0,
                seats: 0,
                description: ''
            };

            formData.name = form.elements.name.value;
            formData.type = vehicleTypes.findIndex(type => type === form.elements.type.value);
            formData.seats = +form.elements.seats.value;
            formData.description = form.elements.description.value;

            createVehicle(formData)
                .then(response => {
                    if (response && image) {
                        uploadVehicleImage(image, response.id);
                    }
                })
                .catch(error => {console.error("Error updating user:", error);});
            props.onHide();
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    return (
        <Modal
            {...props}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    FAHRZEUG HINZUFÜGEN
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row>
                        <Form.Group as={Col} className="mb-3" controlId="name">
                            <Form.Control
                                required
                                type="text"
                                placeholder="Name"/>
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3" controlId="type">
                            <Form.Select required>
                                {vehicleTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} xs={3} className="mb-3" controlId="seats">
                            <Form.Control
                                required
                                type="number"
                                step={1}
                                min={1}
                                max={20}
                                placeholder="Sitzplätze"/>
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Control as="textarea" rows={3} placeholder="Beschreibung (optional)"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="picture">
                        <Form.Label>Bild hinzufügen (optional)</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                    </Form.Group>

                    <Row>
                        <Col className="d-flex align-items-end">
                            {previewUrl && (
                                <div className="image-preview-container">
                                    <Image src={previewUrl} alt="Vehicle" roundedCircle  className="preview-image"  />
                                    <Button variant="danger" onClick={removeImage}>Bild entfernen</Button>
                                </div>
                            )}
                        </Col>
                        <Col xs={12} md="auto" className="text-end d-flex align-items-end justify-content-end">
                            <Button type="submit" className="mainButton">Fahrzeug hinzufügen</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default VehicleAddModalComponent;
