import {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';

import placeholderImg from "../../assets/img/user-default-placeholder.png";

import UserTripsComponent from "../components/User/UserTripsComponent";
import UserTransportsComponent from "../components/User/UserTransportsComponent";
import UserRatingsComponent from "../components/User/UserRatingsComponent";

import {User} from "../../interfaces/User";

import {getAUser} from "../../services/userService";
import {useNavigate, useParams} from "react-router-dom";

function ProfilPage() {
    const { userId } = useParams();
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [currentSection, setCurrentSection] = useState("Fahrten");
    const [userData, setUserData] = useState<User | null>(null);
    const [userAge, setUserAge] = useState<number | null>(null);
    const entryDate = new Date((userData as any)?.entryDate);
    const formattedEntryDate = entryDate.toLocaleDateString();
    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {
            const data = await getAUser(userId);
            if (data !== null) {
                setUserData(data as any);
                setProfileImageUrl((data as any)?.profilePicture);
                const bDate = calculateAge(new Date((data as any)?.birthday));
                setUserAge(bDate);
            } else {
                navigate('/404');
            }
        };

        fetchData();
    }, [userId]);


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


    const renderSectionContent = () => {
        switch (currentSection) {
            case "Fahrten":
                return <UserTripsComponent/>;
            case "Zu Transportieren":
                return <UserTransportsComponent/>;
            case "Bewertungen":
                return <UserRatingsComponent/>;
            default:
                return null;
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <>
            <Container className="content-container">
                <span className="back_btn" onClick={handleGoBack}><i className="icon-angle-left"></i> <span className="back_btn-txt">zurück</span></span>
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

                                    <p className="prof-lable">Handynummer</p>
                                    <p>
                                        {userData.phoneNumber && userData.phoneNumber.length > 0 ? (
                                            <span className="verification-icon"><i className="icon-badge-check"></i> Handynummer verifiziert</span>
                                        ) : (
                                            <span className="verification-icon"><i className="icon-xmark"></i> Handynummer nicht verifiziert (nicht im response)</span>
                                        )}
                                    </p>

                                    <p className="prof-lable">Alter</p>
                                    <p>{userAge} Jahre alt (nicht im response)</p>

                                    <p className="prof-lable">Beschreibung</p>
                                    <p>{userData.description && userData.description.length > 0 ? userData.description : 'Keine Beschreibung vorhanden'}</p>

                                    <p className="prof-lable">Mitglied seit</p>
                                    <p>{formattedEntryDate}</p>
                                </>
                            )}
                            <span className="section-seperator"></span>

                            <Row>
                                <p style={{color: '#aeaeae'}}>40 Abgeschlossene Fahrten(nicht implementiert)</p>

                                <div className="rating-wrapper">
                                    <div className="rating-txt"><span><i className="icon-user"></i> Gesamt</span> <span>97%</span></div>
                                    <ProgressBar now={97}/>
                                </div>

                                <div className="rating-wrapper">
                                    <div className="rating-txt"><span><i className="icon-car"></i> Fahrt</span> <span>85%</span></div>
                                    <ProgressBar now={85}/>
                                </div>

                                <div className="rating-wrapper">
                                    <div className="rating-txt"><span><i className="icon-clock"></i> Pünktlich</span> <span>100%</span></div>
                                    <ProgressBar now={100}/>
                                </div>

                                <div className="rating-wrapper">
                                    <div className="rating-txt"><span><i className="icon-handshake"></i> Zuverlässig</span> <span>70%</span></div>
                                    <ProgressBar now={70}/>
                                </div>

                            </Row>

                        </div>
                    </Col>

                    <Col sm={8} id="prof-content">
                        <div className="profil_navi">
                            <span onClick={() => setCurrentSection("Fahrten")} className={`prof-tab ${currentSection === "Fahrten" ? "active" : ""}`}> Fahrten </span>
                            <span onClick={() => setCurrentSection("Zu Transportieren")} className={`prof-tab ${currentSection === "Zu Transportieren" ? "active" : ""}`}> Zu Transportieren </span>
                            <span onClick={() => setCurrentSection("Bewertungen")} className={`prof-tab ${currentSection === "Bewertungen" ? "active" : ""}`}> Bewertungen </span>
                        </div>

                        {renderSectionContent()}

                    </Col>
                </Row>

            </Container>




        </>
    );
}

export default ProfilPage;