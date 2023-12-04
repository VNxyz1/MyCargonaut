import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {useState} from "react";

function LoginForm() {
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
            <Card style={{width: '30rem', height: 'min-content'}}>
                <Card.Body>
                    <Card.Title>Login</Card.Title>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="loginEmail">
                            <Form.Control required type="email" placeholder="E-Mail"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="loginPassword">
                            <Form.Control required type="password" placeholder="Passwort"/>
                            <Form.Text className="text-muted formLink">
                                    Passwort vergessen?
                            </Form.Text>
                        </Form.Group>
                        {/* TODO: remember me checkbox is not used (session) */}
                        <Form.Group className="mb-3" controlId="rememberMeCheckbox">
                            <Form.Check type="checkbox" label="Remember Me"/>
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

export default LoginForm