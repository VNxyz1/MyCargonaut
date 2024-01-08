import React, {useState, useEffect} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import placeholderImg from "../../assets/img/user-default-placeholder.png";

import MyTripsComponent from "../components/Profile/MyTripsComponent";
import MyTransportsComponent from "../components/Profile/MyTransportsComponent";
import MyVehiclesComponent from "../components/Profile/MyVehiclesComponent";
import MyRatingsComponent from "../components/Profile/MyRatingsComponent";
import ProfileEditModal from "../components/Profile/ProfileEditModalComponent";
import VehicleAddModal from "../components/Profile/VehicleAddModalComponent";
import {useAuth} from '../../AuthContext';
import {useNavigate} from "react-router-dom";
import {Image, Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ProfileEditModalComponent from "../components/Profile/ProfileEditModalComponent";

function ProfilPage() {
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [currentSection, setCurrentSection] = useState("Meine Fahrten");
    const [showProfileEditModal, setShowProfileEditModal] = useState(false);
    const [showVehicleAddModal, setShowVehicleAddModal] = useState(false);
    const [showEditImageModal, setShowEditImageModal] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userAge, setUserAge] = useState<number | null>(null);
    const entryDate = new Date((userData as any)?.entryDate);
    const formattedEntryDate = entryDate.toLocaleDateString();
    const {isAuthenticated, logout} = useAuth();
    const navigate = useNavigate();

    const renderSectionContent = () => {
        switch (currentSection) {
            case "Meine Fahrten":
                return <MyTripsComponent/>;
            case "Meine Transporte":
                return <MyTransportsComponent/>;
            case "Meine Fahrzeuge":
                return <MyVehiclesComponent/>;
            case "Bewertungen":
                return <MyRatingsComponent/>;
            default:
                return null;
        }
    };

    const openProfileEditModal = () => {
        setShowProfileEditModal(true);
    };

    const openVehicleAddModal = () => {
        setShowVehicleAddModal(true);
    };

    const calculateAge = (birthDate: Date): number | null => {
        const currentDate = new Date();

        if (isNaN(birthDate.getTime())) {
            return null;
        }
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    useEffect(() => {
        if (isAuthenticated) {
            getLoggedInUser();
        } else {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const getLoggedInUser = async () => {
        try {
            const res = await fetch("/user", {
                method: "GET",
                headers: {},
            });
            if (res.ok) {
                const data = await res.json();
                setUserData(data);
                setProfileImageUrl(data.profilePicture);

                const bDate = calculateAge(new Date(data.birthday));
                setUserAge(bDate);
            } else {
                console.error("Error fetching user data");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("/auth/logout", {
                method: "POST",
                headers: {"Content-type": "application/json"},
            });

            if (response.ok) {
                /*const data = await response.json();
                console.log(data);*/
                logout();
                navigate('/');
            } /*else {
                const data = await response.json();
                console.log(data);
            }*/
        } catch (error) {
            console.error("Error:", error);
        }
    };

    /*-----Image-----*/
    const handleShowEditImageModal = () => {
        setShowEditImageModal(true);
    };

    const handleCloseEditImageModal = () => {
        setShowEditImageModal(false);
        getLoggedInUser();
    };

    const handleUploadImage = async () => {
        if (image) {
            await uploadImage();
        }
        handleCloseEditImageModal();
    };

    const uploadImage = async () => {
        try {
            const userImage = new FormData();
            userImage.append('image', image as any);

            const imgRes = await fetch('/user/upload', {
                method: 'PUT',
                body: userImage,
            });

            if (!imgRes.ok) {
                const imageData = await imgRes.json();
                console.log('Image upload failed:', imageData);
                return;
            } else {
                console.log(imgRes)
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

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

    const deleteImage = async () => {
        try {
            const response = await fetch("/user/remove-profile-image", {
                method: "DELETE",
                headers: {"Content-type": "application/json"},
            });
            if (response.ok) {
                /*const res = await response.json();
                console.log(res);*/
                getLoggedInUser();
            }/* else {
                const res = await response.json();
                console.log(res);
            }*/
        } catch (error) {
            console.error("Error:", error);
        }
    }

    /*-----Profil-----*/
    const handleShowDeleteProfileModal = () => {
        setShowDeleteProfileModal(true);
    };

    const handleCloseDeleteProfileModal = () => {
        setShowDeleteProfileModal(false);
    };

    const handleConfirmDeleteUser = async () => {
        await deleteUser();
        handleCloseDeleteProfileModal();
    };

    const deleteUser = async () => {
        try {
            const response = await fetch("/user", {
                method: "DELETE",
                headers: {"Content-type": "application/json"},
            });
            if (response.ok) {
                /*const data = await response.json();
                console.log(data);*/
                logout();
                navigate('/');
            } /*else {
                const data = await response.json();
                console.log(data);
            }*/
        } catch (error) {
            console.error("Error:", error);
        }
    }


    return (
        <>
            <Container className="content-container">
                <Row>

                    <Col sm={4} id="prof-sidebar">
                    <div>

                        <img
                            src={profileImageUrl ? `http://localhost:3000/user/profile-image/${profileImageUrl}` : placeholderImg}
                            alt="User profile image"
                        />

                        <div className="profil_navi">
                            <span onClick={handleShowEditImageModal}><i className="icon-pen-to-square"></i></span>
                            {profileImageUrl && (
                                <span onClick={deleteImage}><i className="icon-trash"></i></span>
                            )}
                        </div>

                        {userData && (
                            <>
                                <p>{(userData as any).firstName} {(userData as any).lastName}</p>
                                <p className="prof-lable">E-Mail</p>
                                <p>{(userData as any).eMail}</p>
                                <p className="prof-lable">Handynummer</p>
                                <p>{(userData as any).phoneNumber}</p>
                                <p className="prof-lable">Coins</p>
                                <p>{(userData as any).coins} Coins</p>
                                <p className="prof-lable">Alter</p>
                                <p>{userAge} Jahre alt</p>

                                <p className="prof-lable">Beschreibung</p>
                                <p>{(userData as any).description.length > 0 ? (userData as any).description : 'Keine Beschreibung vorhanden'}</p>
                                <p className="prof-lable">Mitglied seit</p>
                                <p>{formattedEntryDate}</p>
                            </>
                        )}
                        <span className="section-seperator"></span>
                        <p>Bewertungen</p>
                        <p style={{color: '#aeaeae'}}>4,7 40 Ratings (statisch - nicht implementiert)</p>
                        <p style={{color: '#aeaeae'}}>40 Abgeschlossene Fahrten(statisch - nicht implementiert)</p>

                        <div className="prof-side-btn-wrapper">
                            <span className="section-seperator"></span>

                            <span className="disabled"><i className="icon-plus"></i> Fahrt anlegen (nicht implementiert)</span>
                            <span className="disabled"><i className="icon-plus"></i> Transport anlegen (nicht implementiert)</span>
                            <span onClick={openVehicleAddModal}><i className="icon-plus"></i> Fahrzeug hinzufügen</span>

                            <span className="section-seperator"></span>

                            <span onClick={openProfileEditModal}><i className="icon-gear"></i> Profil bearbeiten</span>
                            <span onClick={handleShowDeleteProfileModal}><i className="icon-trash"></i> Profil löschen</span>

                            <span className="section-seperator"></span>

                            <span onClick={handleLogout}> <i className="icon-arrow-right-from-bracket"></i> Logout</span>
                        </div>

                        <Modal show={showEditImageModal} onHide={handleCloseEditImageModal} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Bild aktualisieren</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Form.Group as={Col} className="sm-6" controlId="profilePicture">
                                        <Form.Label>Profilbild</Form.Label>
                                        <Form.Control
                                            name="profilePicture"
                                            type="file"
                                            accept=".jpg, .jpeg, .png"
                                            onChange={handleImageChange}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Col className="d-flex align-items-end" sm-6>
                                        {previewUrl && (
                                            <div className="image-preview-container">
                                                <Image src={previewUrl} alt="Vehicle" roundedCircle className="preview-image"/>
                                                <Button variant="danger" onClick={removeImage}>Bild entfernen</Button>
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="mainButton" onClick={handleUploadImage}>Bild Speichern</Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={showDeleteProfileModal} onHide={handleCloseDeleteProfileModal} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Profil löschen</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Möchten du dein Profil <strong>unwiderruflich</strong> löschen?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={handleConfirmDeleteUser}> Profil löschen </Button>
                                <Button variant="secondary" onClick={handleCloseDeleteProfileModal}> Abbrechen </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    </Col>

                    <Col sm={8} id="prof-content">
                        <div className="profil_navi">
                            <span onClick={() => setCurrentSection("Meine Fahrten")} className={`prof-tab ${currentSection === "Meine Fahrten" ? "active" : ""}`}> Meine Fahrten </span>
                            <span onClick={() => setCurrentSection("Meine Transporte")} className={`prof-tab ${currentSection === "Meine Transporte" ? "active" : ""}`}> Meine Transporte </span>
                            <span onClick={() => setCurrentSection("Meine Fahrzeuge")} className={`prof-tab ${currentSection === "Meine Fahrzeuge" ? "active" : ""}`}> Meine Fahrzeuge </span>
                            <span onClick={() => setCurrentSection("Bewertungen")} className={`prof-tab ${currentSection === "Bewertungen" ? "active" : ""}`}> Bewertungen </span>
                        </div>

                        {renderSectionContent()}

                    </Col>

                </Row>
            </Container>

            <VehicleAddModal show={showVehicleAddModal} onHide={() => setShowVehicleAddModal(false)}/>
            <ProfileEditModal show={showProfileEditModal} userData={userData} onHide={() => setShowProfileEditModal(false)}/>

            <ProfileEditModalComponent
                show={showProfileEditModal}
                onHide={() => {
                    setShowProfileEditModal(false);
                    getLoggedInUser();
                }}
                userData={userData} // Übergeben der Benutzerdaten
            />




        </>
    );
}

export default ProfilPage;