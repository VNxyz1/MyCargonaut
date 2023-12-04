import React, { useState, useEffect } from "react";
import {Modal, Image, ModalProps} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

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
            if (image) {
                console.log("image");
            }
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
                        <Form.Group as={Col} className="mb-3" controlId="vehicleName">
                            <Form.Control
                                required
                                type="text"
                                placeholder="Name"/>
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3" controlId="vehicleType">
                            <Form.Select required>
                                <option value="">Fahrzeugtyp</option>
                                {vehicleTypes.map((type, index) => (
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
                                placeholder="Sitzplätze"/>
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3" controlId="registerEmail">
                        <Form.Control as="textarea" rows={3} placeholder="Beschreibung (optional)"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="vehicleImage">
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
