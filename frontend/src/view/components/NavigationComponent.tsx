import Container from 'react-bootstrap/Container';
import Logo from "../../assets/img/Logo.png";
import {Link} from "react-router-dom";
import {useAuth} from '../../services/authService';
import {useEffect, useState} from "react";
import { chatStore } from './Chat-Page/chats-zustand.ts';
import ListGroup from 'react-bootstrap/ListGroup';

function NavigationComponent() {
    const {isAuthenticated} = useAuth();
    const [isSticky, setSticky] = useState(false);
    const { unreadMessagesTotal } = chatStore();

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
            <div className={`spacer`} style={{height: `${spacerHeight}px`}}/>
            <div className={`navigation ${isSticky ? 'sticky' : ''}`}>
                <Container>
                    <div className="navi_content">
                        <div className="logo_cont">
                            <Link to="/">
                                <img src={Logo} alt="MyCargonout Logo"/>
                            </Link>
                        </div>
                        <nav>

                            <input type="checkbox" id="toggle_button"></input>

                            <label htmlFor="toggle_button" className="toggle_button">
                                <span className="bar bar-1"></span>
                                <span className="bar bar-2"></span>
                                <span className="bar bar-3"></span>
                            </label>

                            <ul>
                              <li><Link to="/search-transport?t=offer">Fahrt suche</Link></li>
                              <li><Link to="/search-transport?t=request">Cargo suchen</Link></li>
                                {!isAuthenticated && (
                                    <>
                                        <li><Link to="/login">Fahrt veröffentlichen</Link></li>
                                        <li><Link to="/login">Cargo veröffentlichen</Link></li>
                                        <li><Link to="/login" className="nav-login-btn">Login</Link></li>
                                    </>
                                )}

                                {isAuthenticated && (
                                    <>
                                        <li><Link to="/profil">Fahrt veröffentlichen</Link></li>
                                        <li><Link to="/profil">Cargo veröffentlichen</Link></li>
                                        <li className='d-lg-none'><Link to="/messages">Nachrichten</Link></li>
                                        <ListGroup.Item className='d-none d-lg-block'>
                                            <Link to="/messages">Nachrichten</Link>
                                            {unreadMessagesTotal > 0 ?
                                              <span className="unread-message-badge-slim"></span>
                                              : <></>
                                            }
                                        </ListGroup.Item>
                                        <li><Link to="/profil">Profil</Link></li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                </Container>
            </div>
        </div>

    );
}


export default NavigationComponent;

