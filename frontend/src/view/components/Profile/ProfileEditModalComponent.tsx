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
    const [feedback, setFeedback] = useState<string | undefined>(undefined);
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

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const res = await updateUser(formData);

        if (res.success) {
            props.onHide();
        } else {
            setFeedback(res.error);
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
                <Form onSubmit={handleSubmit} className="editUserModalBody">
                    <Row>
                        <Form.Group as={Col} className="sm-6 editField" controlId="firstName">
                            <Form.Label>Vorname</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} className="sm-6 editField" controlId="lastName" >
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
                        <Form.Group as={Col} className="sm-6" controlId="birthday" >
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
                                placeholder="z.B. +49 123456789"
                            />
                            <small>
                                Bitte verwende deine Ländervorwahl (z.B. +49).<br />
                                Deine Nummer ist nicht für andere Nutzer sichtbar.
                            </small>
                        </Form.Group>
                    </Row>



                    <Form.Group controlId="description" className="editField">
                        <Form.Label>Beschreibung</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {!feedback ?
                        <></>
                        :
                        <div className="editField">
                            <Form.Text style={{color: 'red'}}>
                                {feedback}
                            </Form.Text>
                        </div>
                    }
                    <Button type="submit" className="mainButton"> Speichern </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ProfileEditModalComponent;
