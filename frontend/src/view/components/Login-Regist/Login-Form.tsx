import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {useState} from "react";
import {useAuth, loginUser} from '../../../services/authService';
import {useNavigate} from 'react-router-dom';

interface LoginDataProps {
    eMail: string;
    password: string;
}

function LoginForm() {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState<string | undefined>(undefined);
    const [loginData, setLoginData] = useState<LoginDataProps>({eMail: "", password: ""});

    const handleSubmit = async (event: any) => {

        event.preventDefault();
        event.stopPropagation();

        try {
            const res = await loginUser(loginData);

            if (res.success) {
                login();
                navigate('/profil');
            } else {
                setFeedback(res.error);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleFormChange = (prop: string, value: string) => {
        setLoginData({
            ...loginData,
            [prop]: value
        })
    }

    return (
        <>
            <Card style={{width: '30rem', height: 'min-content'}}>
                <Card.Body>
                    <Card.Title>Login</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="loginEmail">
                            <Form.Control
                                required
                                type="email"
                                placeholder="E-Mail"
                                onChange={(event) => handleFormChange("eMail", event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="loginPassword">
                            <Form.Control
                                required
                                type="password"
                                placeholder="Passwort"
                                onChange={(event) => handleFormChange("password", event.target.value)}
                            />
                            {!feedback ?
                                <></>
                                :
                                <p style={{fontStyle: "italic"}}>
                                    {feedback}
                                </p>
                            }
                        </Form.Group>

                        <Button type="submit" className="mainButton">
                            login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}

export default LoginForm