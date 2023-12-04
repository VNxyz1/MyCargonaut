import Container from 'react-bootstrap/Container';

import Logo from "../../assets/img/Logo.png";
import { Link } from "react-router-dom"; // Importiere Link aus react-router-dom


function NavigationComponent() {
    return (
        <div className="navigation">
            <Container>
                <div className="navi_content">
                    <div>
                        <a href="/">
                            <img src={Logo} alt="MyCargonout Logo" />
                        </a>
                    </div>
                    <div>
                        <ul>
                            <li><a href="#">Suche</a></li>
                            <li><a href="#">Fahrt veröffentlichen</a></li>
                            <li><a href="#">Transport veröffentlichen</a></li>
                            <li><Link to="/profil">Profil</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </ul>
                    </div>
                </div>
            </Container>
        </div>
);
}

export default NavigationComponent;

