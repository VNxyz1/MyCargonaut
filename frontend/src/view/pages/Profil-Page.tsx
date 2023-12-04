import {useState} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import MyTripsComponent from "../components/MyTripsComponent";
import MyTransportsComponent from "../components/MyTransportsComponent";
import MyVehiclesComponent from "../components/MyVehiclesComponent";
import ProfileEditModal from "../components/ProfileEditModalComponent";

function ProfilPage() {
    const [currentSection, setCurrentSection] = useState("Meine Fahrten");
    const [showProfileEditModal, setShowProfileEditModal] = useState(false);

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

    return (
        <>
            <Container className="content-container">
                <Row>
                    <Col sm={4} id="prof-sidebar">

                        <img src="f"></img>
                        <p>Viktor Schuster</p>
                        <p>4,7 40 Ratings</p>

                        <p>Das ist eine unglaublich spannende Beschreibung über die Persönlichkeit dieser Person.</p>

                        <p>28 Jahre alt</p>
                        <p>40 Abgeschlossene Fahrten</p>
                        <p>Mitglied seit 15.07.2021</p>
                        <div className="prof-side-btn-wrapper">
                            <span className="disabled"> [Icon] Fahrt anlegen</span>
                            <span className="disabled"> [Icon] Transport anlegen</span>
                            <span className="disabled"> [Icon] Fahrzeug hinzufügen</span>
                            <span onClick={openProfileEditModal}> [Icon] Profil bearbeiten</span>
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

            {/* Modalfenster für Profil bearbeiten */}
            {showProfileEditModal && <ProfileEditModal onClose={() => setShowProfileEditModal(false)}/>}
        </>
    );
}

export default ProfilPage;