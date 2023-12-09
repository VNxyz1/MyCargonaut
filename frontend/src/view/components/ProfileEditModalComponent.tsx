import React, {useState, useEffect} from 'react';
import {Modal, ModalProps} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useAuth} from "../../AuthContext";

interface ProfileEditModalComponentProps extends ModalProps {
    onHide: () => void;
}

const ProfileEditModalComponent: React.FC<ProfileEditModalComponentProps> = (props) => {
    const {isAuthenticated} = useAuth();
    const [formData, setFormData] = useState({
        birthday: undefined,
        firstName: '',
        lastName: '',
        phoneNumber:'',
        eMail: '',
        password: '',
        profilePicture: null,
        description: '',
    });


    useEffect(() => {
        console.log("PROFIL EDIT COMPONENT LOADED");

        const fetchUserData = async () => {
            try {
                const res = await fetch("/user", {
                    method: "GET",
                    headers: {},
                });
                if (res.ok) {
                    const userData = await res.json();
                    console.log(userData);

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
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };


    const handleSubmit = async (event: any) => {
        event.preventDefault();
        console.log(formData);

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
               console.log(data);
            } else {
                const data = await response.json();
                console.log(data);
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    /*
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setFormData((prevData) => ({ ...prevData, profilePicture: file }));
            console.log(file);
        }
    };*/

    return (

        <Modal
            {...props}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    PROFIL BEARBEITEN
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="firstName">
                        <Form.Label>Vorname</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="lastName">
                        <Form.Label>Nachname</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="eMail">
                        <Form.Label>E-Mail</Form.Label>
                        <Form.Control
                            type="email"
                            name="eMail"
                            value={formData.eMail}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="birthday">
                        <Form.Label>Geburtsdatum</Form.Label>
                        <Form.Control
                            type="date"
                            name="birthday"
                            value={formData.birthday ? new Date(formData.birthday).toISOString().slice(0, 10) : ''}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="phoneNumber">
                        <Form.Label>Nummer</Form.Label>
                        <Form.Control
                            type="string"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>


                    <Form.Group controlId="password">
                        <Form.Label>Passwort</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
   {/*
                    <Form.Group controlId="profilePicture">
                        <Form.Label>Profilbild</Form.Label>
                        <Form.File
                            name="profilePicture"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Form.Group>


                    <Form.Group controlId="description">
                        <Form.Label>Beschreibung</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    */}

                    <Button type="submit" className="mainButton"> Speichern </Button>
                </Form>
            </Modal.Body>
        </Modal>


    );
};

export default ProfileEditModalComponent;
