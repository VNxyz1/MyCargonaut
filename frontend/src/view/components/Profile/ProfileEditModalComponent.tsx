import React, {useState, useEffect} from 'react';
import {Modal, ModalProps} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useAuth} from "../../../services/authService";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {User} from "../../../models/User";
import { updateUser } from "../../../services/userService";

interface ProfileEditModalComponentProps extends ModalProps {
    onHide: () => void;
    userData: User | null;
}

const ProfileEditModalComponent: React.FC<ProfileEditModalComponentProps> = (props) => {
    const {isAuthenticated} = useAuth();
    const [formData, setFormData] = useState<User>({
        firstName: '',
        lastName: '',
        birthday: new Date(),
        phoneNumber: '',
        description: '',
    });

    useEffect(() => {
        if (isAuthenticated && props.userData) {
            setFormData({
                firstName: props.userData.firstName || '',
                lastName: props.userData.lastName || '',
                birthday: props.userData.birthday || new Date(),
                phoneNumber: props.userData.phoneNumber || '',
                description: props.userData.description || '',
            });
        }
    }, [isAuthenticated, props.userData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    //TODO Ü18 Prüfung
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const res = await updateUser(formData);

        if (res.success) {
            props.onHide();
        } else {
            console.error("Error updating user:", res.error);
        }
    };

    return (
        <Modal
            {...props}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>PROFIL BEARBEITEN</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Form.Group as={Col} className="sm-6" controlId="firstName">
                            <Form.Label>Vorname</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} className="sm-6" controlId="lastName">
                            <Form.Label>Nachname</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group as={Col} className="sm-6" controlId="birthday">
                            <Form.Label>Geburtsdatum</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthday"
                                value={formData.birthday ? new Date(formData.birthday).toISOString().slice(0, 10) : ''}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} className="sm-6" controlId="phoneNumber">
                            <Form.Label>Handynummer</Form.Label>
                            <Form.Control
                                type="string"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group controlId="description">
                        <Form.Label>Beschreibung</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Button type="submit" className="mainButton"> Speichern </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ProfileEditModalComponent;
