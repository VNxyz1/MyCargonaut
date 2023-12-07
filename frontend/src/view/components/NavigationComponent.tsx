import Container from 'react-bootstrap/Container';

import Logo from "../../assets/img/Logo.png";
import { Link } from "react-router-dom";
import { useAuth } from '../../AuthContext';
import { useNavigate  } from 'react-router-dom';


function NavigationComponent() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

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

    return (
        <div className="navigation">
            <Container>
                <div className="navi_content">
                    <div>
                        <Link to="/">
                            <img src={Logo} alt="MyCargonout Logo" />
                        </Link>
                    </div>
                    <div>
                        <ul>
                            <li><Link to="/search-transport">Transport suche</Link></li>
                            <li><Link to="/search-cargo">Fracht suchen</Link></li>
                            {!isAuthenticated && (
                                <>
                                    <li><Link to="/login">Fahrt veröffentlichen</Link></li>
                                    <li><Link to="/login">Transport veröffentlichen</Link></li>
                                    <li><Link to="/login">Login</Link></li>
                                </>
                            )}

                            {isAuthenticated && (
                                <>
                                    <li><Link to="/profil">Fahrt veröffentlichen</Link></li>
                                    <li><Link to="/profil">Transport veröffentlichen</Link></li>
                                    <li><Link to="/404">Nachrichten</Link></li>
                                    <li><Link to="/profil">Profil</Link></li>
                                    <li><a href="#" onClick={handleLogout}>Logout</a></li>
                                </>
                            )}

                        </ul>
                    </div>
                </div>
            </Container>
        </div>
);
}

export default NavigationComponent;

