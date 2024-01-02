import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import transporter from "../../assets/img/home_transport.png";
import pakete from "../../assets/img/home_package.png";
import skyline from "../../assets/img/skyline_weiß.png";
import {Link} from "react-router-dom";


function HomePage() {

    return (
        <>
            <div className="home_header">
                <Container className="content_area">
                    <h1 className="homeTitel">Fahrt <strong>teilen</strong> - Kosten  <strong>sparen</strong></h1>
                    <h1 className="homeTitel">Finde deine ideale Fahrgemeinschaft!</h1>
                </Container>
                <img className="home_header_skyline" src={skyline}></img>
            </div>


            <Container className="content-container home-content">
                <Row>
                    <Col sm={6} className="homeImg">
                        <img src={transporter}></img>
                    </Col>
                    <Col sm={6} className="homeTxtBox-r">
                        <p>FAHRT ANBIETEN</p>
                        <h3>Bist du auf dem Weg und kannst jemanden mitnehmen oder etwas transportieren?</h3>
                        <div className="btn_wrapper">
                            <Link to="/search-cargo"><Button className="mainButton">Cargo suchen</Button></Link>
                            <Link to="/profil"><Button className="mainButton">Fahrt anlegen</Button></Link>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col sm={6} className="homeTxtBox-l">
                        <p>TRANSPORTIEREN LASSEN</p>
                        <h3>Suchst du eine Mitfahrgelegenheit oder jemanden, der etwas für dich transportiert?</h3>
                        <div className="btn_wrapper">
                            <Link to="/search-transport"><Button className="mainButton">Fahrt suche</Button></Link>
                            <Link to="/profil"><Button className="mainButton">Cargo anlegen</Button></Link>
                        </div>
                    </Col>
                    <Col sm={6} className="homeImg">
                        <img src={pakete}></img>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default HomePage;

