import {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import placeholderImg from "../../assets/img/user-default-placeholder.png";

import UserTripsComponent from "../components/User/UserTripsComponent";
import UserTransportsComponent from "../components/User/UserTransportsComponent";
import UserRatingsComponent from "../components/User/UserRatingsComponent";

import {User} from "../../interfaces/User";

import {getAUser} from "../../services/userService";
import {useNavigate, useParams} from "react-router-dom";
import AverageRatingsComponent from "../components/Ratings/AverageRatingsComponent.tsx";
import {useAuth} from '../../services/authService';

function ProfilPage() {
    const { userId } = useParams();
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [currentSection, setCurrentSection] = useState("Angebote");
    const [userData, setUserData] = useState<User | null>(null);
    const {isAuthenticated} = useAuth();
    const entryDate = new Date((userData as any)?.entryDate);
    const formattedEntryDate = entryDate.toLocaleDateString();
    const navigate = useNavigate();

    useEffect(() => {
        //TODO: Prüfen ob es der eigene Nutzer ist, wenn ja, dann umleiten auf Profil
        if (isAuthenticated) {

            const fetchData = async () => {
                const data = await getAUser(userId);
                if (data !== null) {
                    setUserData(data as any);
                    setProfileImageUrl((data as any)?.profilePicture);

                } else {
                    navigate('/404');
                }
            };
            fetchData();


        } else {
            console.log("Du musst eingeloggt sein, um die seite zu sehen.")
            navigate('/login');
        }


    }, [isAuthenticated, userId]);


    const renderSectionContent = () => {
        switch (currentSection) {
            case "Angebote":
                return <UserTripsComponent/>;
            case "Gesuche":
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

                                    <p className="prof-lable">Alter</p>
                                    <p>{userData.age}</p>

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

                        </div>
                    </Col>

                    <Col sm={8} id="prof-content">
                        <div className="profil_navi">
                            <span onClick={() => setCurrentSection("Angebote")} className={`prof-tab ${currentSection === "Angebote" ? "active" : ""}`}> Angebote </span>
                            <span onClick={() => setCurrentSection("Gesuche")} className={`prof-tab ${currentSection === "Gesuche" ? "active" : ""}`}> Gesuche </span>
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