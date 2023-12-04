import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {useState} from "react";

function RegisterForm() {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        }

        setValidated(true);
    };

    return (
        <>
            <Card style={{width: '30rem'}}>
                <Card.Body>
                    <Card.Title>Sign in</Card.Title>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group as={Col} className="mb-3" controlId="registerFirstName">
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Vorname"/>
                            </Form.Group>
                            <Form.Group as={Col} className="mb-3" controlId="registerLastName">
                                <Form.Control
                                required
                                type="text"
                                placeholder="Nachname"/>
                            </Form.Group>
                        </Row>
                        <Form.Group className="mb-3" controlId="registerEmail">
                            <Form.Control required type="email" placeholder="E-Mail"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="registerBirthdate">
                            <Form.Control required type="date" placeholder="Geburtsdatum"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="registerPassword">
                            <Form.Control required type="password" placeholder="Passwort"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="registerPasswordRepeat">
                            <Form.Control required type="password" placeholder="Passwort wiederholen"/>
                        </Form.Group>
                        <Button type="submit" className="mainButton">
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );

}

export default RegisterForm