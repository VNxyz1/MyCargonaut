import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Image, Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import placeholderImg from "../../assets/img/user-default-placeholder.png";

import MyTripsComponent from "../components/Profile/MyTripsComponent";
import MyTransportsComponent from "../components/Profile/MyTransportsComponent";
import MyVehiclesComponent from "../components/Profile/MyVehiclesComponent";
import MyRatingsComponent from "../components/Profile/MyRatingsComponent";
import ProfileEditModal from "../components/Profile/ProfileEditModalComponent";
import VehicleAddModal from "../components/Profile/VehicleAddModalComponent";
import RatingAddModal from "../components/Profile/RatingModalComponent.tsx";

import {User} from "../../interfaces/User";

import {useAuth, logoutUser} from '../../services/authService';
import {getLoggedInUser, uploadImage, deleteProfileImage, deleteUser} from "../../services/userService";
import AverageRatingsComponent from "../components/Ratings/AverageRatingsComponent.tsx";

function UserPage() {
    const [profileImageUrl, setProfileImageUrl] = useState<string| null>(null);
    const [currentSection, setCurrentSection] = useState("Meine Fahrten");
    const [showProfileEditModal, setShowProfileEditModal] = useState(false);
    const [showVehicleAddModal, setShowVehicleAddModal] = useState(false);
    const [showEditImageModal, setShowEditImageModal] = useState(false);
    const [showRatingAddModal, setShowRatingAddModal] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);
    const [userData, setUserData] = useState<User | null>(null);
    const [userAge, setUserAge] = useState<number | null>(null);
    const entryDate = new Date((userData as User)?.entryDate);
    const formattedEntryDate = entryDate.toLocaleDateString();
    const {isAuthenticated, logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            fetchLoggedInUser();
        } else {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

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

    const fetchLoggedInUser = async () => {
        const data = await getLoggedInUser();
        if (data !== null) {
            setUserData(data as User);
            setProfileImageUrl((data as User)?.profilePicture);
            const bDate = calculateAge(new Date((data as User)?.birthday));
            setUserAge(bDate);
        }
    };

    const handleLogout = async () => {
        const isloggedOut = await logoutUser();

        if (isloggedOut) {
            logout();
            navigate('/');
        }
    };

    /*-----Image-----*/
    const handleShowEditImageModal = () => {
        setShowEditImageModal(true);
    };

    const handleCloseEditImageModal = () => {
        setShowEditImageModal(false);
        fetchLoggedInUser();
    };

    const handleUploadImage = async () => {
        if (image) {
            const isImageUploaded = await uploadImage(image);
            if (isImageUploaded) {
                handleCloseEditImageModal();
            }
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

    const removeImagePreview = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    const deleteImage = async () => {
        const isImageDeleted = await deleteProfileImage();
        if (isImageDeleted) {
            fetchLoggedInUser();
        }
    };

    /*-----Profil-----*/
    const handleShowDeleteProfileModal = () => {
        setShowDeleteProfileModal(true);
    };

    const handleCloseDeleteProfileModal = () => {
        setShowDeleteProfileModal(false);
    };

    const handleConfirmDeleteUser = async () => {
        const isUserDeleted = await deleteUser();
        if (isUserDeleted) {
            logout();
            navigate('/');
        }
    };

    /*----------------*/
    const renderSectionContent = () => {
        switch (currentSection) {
            case "Meine Fahrten":
                return <MyTripsComponent/>;
            case "Meine Transporte":
                return <MyTransportsComponent/>;
            case "Meine Fahrzeuge":
                return <MyVehiclesComponent/>;
            case "Bewertungen": {
                if (userData?.id) {
                    return <MyRatingsComponent userId={userData.id}/>;
                }
                return <p>Benutzerdaten konnten nicht geladen werden. Versuche es später erneut.</p>
            }
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

    const openRatingAddModal = () => {
        setShowRatingAddModal(true);
    };

    return (
        <>
            <Container className="content-container">
                <Row>

                    <Col sm={4} id="prof-sidebar">
                        <div>


                            <img
                                src={profileImageUrl ? `${window.location.protocol}//${window.location.host}/user/profile-image/${profileImageUrl}` : placeholderImg}
                                alt="User profile image"
                            />

                            {userData && (
                                <>
                                    <p className="prof-lable">Name</p>
                                    <p>{userData.firstName} {userData.lastName}</p>
                                    <p className="prof-lable">E-Mail</p>
                                    <p>{userData.eMail}</p>
                                    <p className="prof-lable">Handynummer</p>
                                    <p>{userData.phoneNumber && userData.phoneNumber.length > 0 ? userData.phoneNumber : 'Keine Handynummer angegeben'}</p>
                                    <p className="prof-lable">Coins</p>
                                    <p>{userData.coins} Coins</p>
                                    <p className="prof-lable">Alter</p>
                                    <p>{userAge} Jahre alt</p>

                                    <p className="prof-lable">Beschreibung</p>
                                    <p>{userData.description && userData.description.length > 0 ? userData.description : 'Keine Beschreibung vorhanden'}</p>

                                    <p className="prof-lable">Mitglied seit</p>
                                    <p>{formattedEntryDate}</p>
                                </>
                            )}
                            <span className="section-seperator"></span>

                            <Row>
                                {userData?.averageRatings ?
                                    <AverageRatingsComponent averageRatings={userData.averageRatings}/>
                                    : <p>Bewertungen konnten nicht geladen werden.</p>
                                }
                            </Row>

                            <div className="prof-side-btn-wrapper">
                                <span className="section-seperator"></span>
                               {!userData || !userData.phoneNumber ? "Um diese Aktionen auszuführen, musst du deine Handynummer hinterlegen." : ""}
                                {userData && (
                                    <>
                                        <span onClick={() => userData && userData.phoneNumber && openVehicleAddModal()} className={userData && userData.phoneNumber ? "" : "disabled"}><i className="icon-plus"></i> Fahrt anlegen (nicht implementiert)</span>
                                        <span onClick={() => userData && userData.phoneNumber && openVehicleAddModal()} className={userData && userData.phoneNumber ? "" : "disabled"}><i className="icon-plus"></i> Transport anlegen (nicht implementiert)</span>
                                        <span onClick={() => userData && userData.phoneNumber && openVehicleAddModal()} className={userData && userData.phoneNumber ? "" : "disabled"}><i className="icon-plus"></i> Fahrzeug hinzufügen</span>
                                        <span onClick={() => userData && userData.phoneNumber && openRatingAddModal()} className={userData && userData.phoneNumber ? "" : "disabled"}><i className="icon-plus"></i> Fahrt bewerten</span>
                                    </>
                                )}


                                <span className="section-seperator"></span>

                                <span onClick={handleShowEditImageModal}><i className="icon-pen-to-square"></i> Profilbild aktualisieren</span>
                                {profileImageUrl && (<span onClick={deleteImage}><i className="icon-trash"></i> Profilbild entfernen</span>)}

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
                                                    <Button variant="danger" onClick={removeImagePreview}>Bild entfernen</Button>
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
            <RatingAddModal show={showRatingAddModal} onHide={() => setShowRatingAddModal(false)}/>

            <ProfileEditModal
                show={showProfileEditModal}
                onHide={() => {
                    setShowProfileEditModal(false);
                    fetchLoggedInUser();
                }}
                userData={userData as User | null}
            />


        </>
    );
}

export default UserPage;