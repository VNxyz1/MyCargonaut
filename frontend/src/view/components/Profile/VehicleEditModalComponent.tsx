import React, {useEffect, useState} from "react";
import {Image, Modal, ModalProps} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import {deleteVehicleProfileImage, updateVehicle, uploadVehicleImage} from "../../../services/vehicleService.tsx";
import {EditVehicleData, Vehicle, VehicleTypes} from "../../../interfaces/Vehicle.ts";

interface VehicleEditModalProps extends ModalProps {
    onHide: () => void;
    vehicle?: Vehicle;
    onEdit: () => void;
}

const VehicleEditModalComponent: React.FC<VehicleEditModalProps> = (props: VehicleEditModalProps) => {
    const [validated, setValidated] = useState<boolean>(false);
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        setPreviewUrl(props.vehicle?.picture
            ? `${window.location.protocol}//${window.location.host}/vehicle/vehicle-image/${props.vehicle.picture}`
            : null)
        if (!props.show) {
            setValidated(false);
            setImage(null);
            setPreviewUrl(null);
        }
    }, [props.show]);

    const handleSubmit = (event: any) => {
        if (!props.vehicle) {
            return;
        }

        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);
        if (form.checkValidity()) {
            const formData: EditVehicleData = {};

            if (form.elements.name.value.length > 0) formData.name = form.elements.name.value;
            formData.type = VehicleTypes.findIndex(type => type === form.elements.type.value);
            if (form.elements.seats.value.length > 0) formData.seats = +form.elements.seats.value;
            if (form.elements.description.value.length > 0) formData.description = form.elements.description.value;

            updateVehicle(props.vehicle.id, formData)
                .then(() => {
                    if (!props.vehicle) {
                        return;
                    }
                    if (image) {
                        uploadVehicleImage(image, props.vehicle.id).then(() => props.onEdit());
                    } else if (!previewUrl) {
                        deleteVehicleProfileImage(props.vehicle.id).then(() => props.onEdit());
                    }
                    props.onEdit();
                })
                .catch(error => {console.error("Error updating vehicle:", error);});
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
                    FAHRZEUG BEARBEITEN
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.vehicle ?
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group as={Col} className="mb-3" controlId="name">
                                <Form.Control
                                    type="text"
                                    placeholder={props.vehicle.name}/>
                            </Form.Group>
                            <Form.Group as={Col} className="mb-3" controlId="type">
                                <Form.Select>
                                    {VehicleTypes.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} xs={3} className="mb-3" controlId="seats">
                                <Form.Control
                                    type="number"
                                    step={1}
                                    min={1}
                                    max={20}
                                    placeholder={props.vehicle.seats.toFixed()}/>
                            </Form.Group>
                        </Row>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Control as="textarea" rows={3} placeholder={props.vehicle.description}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="picture">
                            <Form.Label>Bild ändern</Form.Label>
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
                                <Button type="submit" className="mainButton">Fahrzeug ändern</Button>
                            </Col>
                        </Row>
                    </Form>
                    :
                    <p>Fahrzeugdaten konnten nicht geladen werden</p>
                }
            </Modal.Body>
        </Modal>
    );
};

export default VehicleEditModalComponent;
