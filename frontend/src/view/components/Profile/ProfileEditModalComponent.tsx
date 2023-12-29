import React, {useState, useEffect} from 'react';
import {Modal, ModalProps} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useAuth} from "../../../AuthContext";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface ProfileEditModalComponentProps extends ModalProps {
    onHide: () => void;
}

const ProfileEditModalComponent: React.FC<ProfileEditModalComponentProps> = (props) => {
    const {isAuthenticated} = useAuth();
    const [formData, setFormData] = useState({
        birthday: undefined,
        firstName: '',
        lastName: '',
        phoneNumber: '',
        description: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch("/user", {
                    method: "GET",
                    headers: {},
                });
                if (res.ok) {
                    const userData = await res.json();
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        ...userData,
                    }));
                } else {
                    console.error("Error fetching user data");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        if (isAuthenticated) {
            fetchUserData();
        }
    }, [isAuthenticated]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const res = await editUser();
        console.log(res);
    }

    const editUser = async () => {
        try {
            const response = await fetch("/user", {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const data = await response.json();
                console.log('User update failed:', data);
            } else {
                const data = await response.json();
                console.log('User updated successfully:', data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

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
