import {useState, useEffect} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import placeholderImg from "../../assets/img/user-default-placeholder.png";

import MyTripsComponent from "../components/MyTripsComponent";
import MyTransportsComponent from "../components/MyTransportsComponent";
import MyVehiclesComponent from "../components/MyVehiclesComponent";
import ProfileEditModal from "../components/ProfileEditModalComponent";
import VehicleAddModal from "../components/VehicleAddModalComponent";
import {useAuth} from '../../AuthContext';
import {useNavigate} from "react-router-dom";


function ProfilPage() {
    const [currentSection, setCurrentSection] = useState("Meine Fahrten");
    const [showProfileEditModal, setShowProfileEditModal] = useState(false);
    const [showVehicleAddModal, setShowVehicleAddModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userAge, setUserAge] = useState<number | null>(null);
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

        console.log("PROFIL - GET USER " + isAuthenticated);

        const getLoggedInUser = async () => {
            try {
                const res = await fetch("/user", {
                    method: "GET",
                    headers: {},
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserData(data);
                    console.log(data);

                    const bDate = calculateAge(new Date(data.birthday));
                    setUserAge(bDate);
                } else {
                    console.error("Error fetching logged in user");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };


        if (isAuthenticated) {
            getLoggedInUser();
        } else {
            navigate('/');
            console.log(" EINLOGGEN UM PROFIL ZUSEHEN!!")
        }
    }, [isAuthenticated, navigate]);



    const handleLogout = async () => {

        try {
            const response = await fetch("/auth/logout", {
                method: "POST",
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
    };

    //TODO dazugehörende User Inserate löschen
    //TODO User wird nocht in der Datenbank entfernt sondern nur zuruckgesetzt
    const deleteUser = async () => {
        try{
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

    return (
        <>
            <Container className="content-container">
                <Row>
                    <Col sm={4} id="prof-sidebar">

                        <img src={placeholderImg} ></img>
                        {userData && (
                            <>
                                <p>{(userData as any).firstName} {(userData as any).lastName}</p>
                                <p>{(userData as any).coins} Coins</p>
                                <p>{userAge} Jahre alt</p>

                            </>
                        )}
                        <p style={{ color: '#aeaeae' }}>4,7 40 Ratings (statisch - nicht implementiert)</p>
                        <p style={{ color: '#aeaeae' }}>Das ist eine unglaublich spannende Beschreibung über die Persönlichkeit dieser Person.(statisch - nicht implementiert)</p>
                        <p style={{ color: '#aeaeae' }}>40 Abgeschlossene Fahrten(statisch - nicht implementiert)</p>
                        <p style={{ color: '#aeaeae' }}>Mitglied seit 15.07.2021(statisch - nicht implementiert)</p>
                        <div className="prof-side-btn-wrapper">
                            <span className="disabled"><i className="icon-plus"></i> Fahrt anlegen (nicht implementiert)</span>
                            <span className="disabled"><i className="icon-plus"></i> Transport anlegen (nicht implementiert)</span>
                            <span onClick={openVehicleAddModal}><i className="icon-plus"></i> Fahrzeug hinzufügen</span>
                            <span onClick={openProfileEditModal}><i className="icon-pen-to-square"></i> Profil bearbeiten</span>
                            <span onClick={deleteUser}><i className="icon-pen-to-square"></i> Profil löschen</span>
                            <span onClick={handleLogout}> <i className="icon-arrow-right-from-bracket"></i> Logout</span>
                        </div>


                    </Col>

                    <Col sm={8} id="prof-content">
                        <div className="profil_navi">
                            <span onClick={() => setCurrentSection("Meine Fahrten")} className={currentSection === "Meine Fahrten" ? "active" : ""}> Meine Fahrten </span>
                            <span onClick={() => setCurrentSection("Meine Transporte")} className={currentSection === "Meine Transporte" ? "active" : ""}> Meine Transporte </span>
                            <span onClick={() => setCurrentSection("Meine Fahrzeuge")} className={currentSection === "Meine Fahrzeuge" ? "active" : ""}> Meine Fahrzeuge </span>
                        </div>

                        {renderSectionContent()}

                    </Col>
                </Row>
            </Container>

            {/* Modalfenster für Profil bearbeiten  TODO: ADD USER EDIT FUNKTION*/}
            <VehicleAddModal show={showVehicleAddModal} onHide={() => setShowVehicleAddModal(false)}/>
            <ProfileEditModal show={showProfileEditModal} onHide={() => setShowProfileEditModal(false)} />

        </>
    );
}

export default ProfilPage;