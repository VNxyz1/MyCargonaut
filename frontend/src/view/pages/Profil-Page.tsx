import {useState, useEffect} from 'react';

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
import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";

function ProfilPage() {
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [currentSection, setCurrentSection] = useState("Meine Fahrten");
    const [showProfileEditModal, setShowProfileEditModal] = useState(false);
    const [showVehicleAddModal, setShowVehicleAddModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userAge, setUserAge] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
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



    const handleShowDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleConfirmDeleteUser = () => {
        deleteUser();
        handleCloseDeleteModal();
    };

    const deleteUser = async () => {
        try {
            const response = await fetch("/user", {
                method: "DELETE",
                headers: {"Content-type": "application/json"},
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                logout();
                navigate('/');
            } else {
                const data = await response.json();
                console.log(data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const deleteImage = async () => {
        try {
            const response = await fetch("/user/remove-profile-image", {
                method: "DELETE",
                headers: {"Content-type": "application/json"},
            });
            if (response.ok) {
                const res = await response.json();
                console.log(res);
                getLoggedInUser();
            } else {
                const res = await response.json();
                console.log(res);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }


    return (
        <>
            <Container className="content-container">
                <Row>
                    <Col sm={4} id="prof-sidebar">
                        <img
                            src={profileImageUrl ? `http://localhost:3000/user/profile-image/${profileImageUrl}` : placeholderImg}
                            alt="User profile image"
                        />

                        <div className="profil_navi">
                            <span><i className="icon-pen-to-square"></i> Bild ändern</span>
                            {profileImageUrl && (
                                <span onClick={deleteImage}><i className="icon-trash"></i> Bild löschen</span>
                            )}
                        </div>

                        {userData && (
                            <>
                                <p>{(userData as any).firstName} {(userData as any).lastName}</p>
                                <p>{(userData as any).coins} Coins</p>
                                <p>{userAge} Jahre alt</p>
                                <p>{(userData as any).description.length > 0 ? (userData as any).description : 'Keine Beschreibung vorhanden'}</p>
                                <p>Mitglied seit: {formattedEntryDate}</p>
                            </>
                        )}

                        <p style={{color: '#aeaeae'}}>4,7 40 Ratings (statisch - nicht implementiert)</p>
                        <p style={{color: '#aeaeae'}}>40 Abgeschlossene Fahrten(statisch - nicht implementiert)</p>

                        <div className="prof-side-btn-wrapper">
                            <span className="disabled"><i className="icon-plus"></i> Fahrt anlegen (nicht implementiert)</span>
                            <span className="disabled"><i className="icon-plus"></i> Transport anlegen (nicht implementiert)</span>
                            <span onClick={openVehicleAddModal}><i className="icon-plus"></i> Fahrzeug hinzufügen</span>
                            <span onClick={openProfileEditModal}><i className="icon-pen-to-square"></i> Profil bearbeiten</span>
                            <span onClick={handleShowDeleteModal}><i className="icon-trash"></i> Profil löschen</span>
                            <span onClick={handleLogout}> <i className="icon-arrow-right-from-bracket"></i> Logout</span>
                        </div>

                        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Profil löschen</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Möchten du dein Profil <strong>unwiderruflich</strong> löschen?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={handleConfirmDeleteUser}> Profil löschen </Button>
                                <Button variant="secondary" onClick={handleCloseDeleteModal}> Abbrechen </Button>
                            </Modal.Footer>
                        </Modal>

                    </Col>

                    <Col sm={8} id="prof-content">
                        <div className="profil_navi">
                            <span onClick={() => setCurrentSection("Meine Fahrten")} className={currentSection === "Meine Fahrten" ? "active" : ""}> Meine Fahrten </span>
                            <span onClick={() => setCurrentSection("Meine Transporte")} className={currentSection === "Meine Transporte" ? "active" : ""}> Meine Transporte </span>
                            <span onClick={() => setCurrentSection("Meine Fahrzeuge")} className={currentSection === "Meine Fahrzeuge" ? "active" : ""}> Meine Fahrzeuge </span>
                            <span onClick={() => setCurrentSection("Bewertungen")} className={currentSection === "Bewertungen" ? "active" : ""}> Bewertungen </span>
                        </div>

                        {renderSectionContent()}

                    </Col>
                </Row>
            </Container>

            <VehicleAddModal show={showVehicleAddModal} onHide={() => setShowVehicleAddModal(false)}/>
            <ProfileEditModal show={showProfileEditModal} onHide={() => setShowProfileEditModal(false)}/>

        </>
    );
}

export default ProfilPage;