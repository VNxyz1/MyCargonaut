import {Modal, ModalProps} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

interface NotLoggedInModalProps extends ModalProps {
    onClose: () => void;
}
function NotLoggedInModal(props: NotLoggedInModalProps) {
    const navigate = useNavigate();

    const navigateToLogin = () => navigate('/login')

    useEffect(() => {

    }, []);

    return (
        <Modal
            {...props}
            centered
            backdrop="static"
        >
            <Modal.Header>
                <Modal.Title>Du bist nicht angemeldet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Noch nicht registriert?
                Wenn du dich registrierst erhällst du Zugriff auf viele tolle Funktionen.
                Schreibe Nachrichten, setze Fahrten auf deine Merkliste und vieles mehr!
            </Modal.Body>
            <Modal.Footer>
                <Button className="mainButton" onClick={props.onClose} style={{backgroundColor: "var(--color-5)"}}>
                    Nicht anmelden
                </Button>
                <Button className="mainButton" onClick={navigateToLogin}>
                    Jetzt anmelden
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NotLoggedInModal