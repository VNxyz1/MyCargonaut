import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import transporter from "../../assets/img/home_transport.png";
import pakete from "../../assets/img/home_package.png";
import {Link, useNavigate} from "react-router-dom";
import {useEffect} from "react";

function HomePage() {

    const navi = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const parallaxElement = document.querySelector('.home_header') as HTMLElement;

            if (parallaxElement) {
                parallaxElement.style.backgroundPosition = `center calc(${-200 + scrollPosition * 0.1}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>

            <div className="home_header">
                <Container className="content_area">
                    <h1 className="homeTitel">Fahrt <strong>teilen</strong> - Kosten  <strong>sparen</strong></h1>
                    <h1 className="homeTitel">Finde deine ideale Fahrgemeinschaft!</h1>
                </Container>
            </div>

            <Container className="content-container home-content">
                <Row>
                    <Col sm={6} className="homeImg">
                        <img src={transporter}></img>
                    </Col>
                    <Col sm={6} className="homeTxtBox-r">
                        <p>FAHRTEN ANBIETEN</p>
                        <h3>Bist du auf dem Weg und kannst jemanden mitnehmen oder etwas transportieren?</h3>
                        <div className="btn_wrapper">
                            <Link to="/search-transport?t=request"><Button className="mainButton">Gesuche ansehen</Button></Link>
                            <Button className="mainButton w-auto" onClick={() => navi('/profil', { state: { redirected: true } })}>Angebot erstellen</Button>
                        </div>
                    </Col>
                </Row>

                <Row className="homeCont-sec">
                    <Col sm={6} className="homeTxtBox-l">
                        <p>TRANSPORTIEREN LASSEN</p>
                        <h3>Suchst du eine Mitfahrgelegenheit oder jemanden, der etwas für dich transportiert?</h3>
                        <div className="btn_wrapper">
                            <Link to="/search-transport?t=offer"><Button className="mainButton w-auto">Angebote ansehen</Button></Link>
                            <Link to="/profil"><Button className="mainButton">Gesuch erstellen</Button></Link>
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

