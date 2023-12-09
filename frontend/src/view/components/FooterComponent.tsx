import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

function FooterComponent() {
    return (

        <div className="footer">
            <Container>
                <span className="foo_copy">&copy; MyCargonaut WS 2023 KMS </span>
                <span className="foo_data">
                    <Link to="/privacy">Datenschutz</Link>
                    <Link to="/imprint">Impressum</Link>
                </span>
                <span className="foo_crew">Anastasia | Elisa | Jimmy | Jonas | Julius | Steffen | Vincent</span>
            </Container>
        </div>

    );
}


export default FooterComponent;

