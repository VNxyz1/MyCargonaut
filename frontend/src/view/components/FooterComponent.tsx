import Container from 'react-bootstrap/Container';

function FooterComponent() {
    return (

        <div className="footer">
            <Container>
                <span className="foo_copy">&copy; MyCargonaut WS 2023 KMS </span>
                <span className="foo_data"><a href="/privacy">Datenschutz</a> <a href="/imprint">Impressum</a></span>
                <span className="foo_crew">Anastasia | Elisa | Jimmy | Jonas | Julius | Steffen | Vincent</span>
            </Container>
        </div>

    );
}


export default FooterComponent;

