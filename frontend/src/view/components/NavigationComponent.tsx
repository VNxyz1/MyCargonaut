import Container from 'react-bootstrap/Container';
import Logo from "../../assets/img/Logo.png";
import { Link } from "react-router-dom";
import { useAuth } from '../../AuthContext';
import {useEffect, useState} from "react";

function NavigationComponent() {
    const { isAuthenticated } = useAuth();
    const [isSticky, setSticky] = useState(false);

    const spacerHeight = isSticky ? 99 : 131;
    const handleScroll = () => {
        setSticky(window.scrollY > 0);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
<div>
    <div className={`spacer`} style={{ height: `${spacerHeight}px` }} />
        <div className={`navigation ${isSticky ? 'sticky' : ''}`}>
            <Container>
                <div className="navi_content">
                    <div>
                        <Link to="/">
                            <img src={Logo} alt="MyCargonout Logo" />
                        </Link>
                    </div>
                    <div>
                        <ul>
                            <li><Link to="/search-transport">Fahrt suche</Link></li>
                            <li><Link to="/search-cargo">Cargo suchen</Link></li>
                            {!isAuthenticated && (
                                <>
                                    <li><Link to="/login">Fahrt veröffentlichen</Link></li>
                                    <li><Link to="/login">Cargo veröffentlichen</Link></li>
                                    <li><Link to="/login">Login</Link></li>
                                </>
                            )}

                            {isAuthenticated && (
                                <>
                                    <li><Link to="/profil">Fahrt veröffentlichen</Link></li>
                                    <li><Link to="/profil">Cargo veröffentlichen</Link></li>
                                    <li><Link to="/messages">Nachrichten</Link></li>
                                    <li><Link to="/profil">Profil</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </Container>
        </div>
        </div>

    );
}


export default NavigationComponent;

