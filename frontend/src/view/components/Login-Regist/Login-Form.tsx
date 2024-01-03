import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {useState} from "react";
import {useAuth} from '../../../AuthContext';
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

    const handleSubmit = async (event: { preventDefault: () => void; stopPropagation: () => void; }) => {
        event.preventDefault();
        event.stopPropagation();
        const res = await postLogin();
        if (res) {
            console.log(res.message);
            setFeedback(res.message);

            if (res.successful) {
                login();
                navigate('/profil');
            }
        }

    };

    const postLogin = async () => {
        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(loginData),
            });
            if (!response.ok) {
                const data = await response.json();
                return {successful: false, message: data.message}
            } else {
                const data = await response.json();
                return {successful: true, message: data.message}
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }


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
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="loginEmail">
                            <Form.Control
                                type="email"
                                placeholder="E-Mail"
                                onChange={(event) => handleFormChange("eMail", event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="loginPassword">
                            <Form.Control
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
                            <Form.Text className="text-muted formLink">
                                Passwort vergessen? (no function)
                            </Form.Text>
                        </Form.Group>
                        {/* TODO: remember me checkbox is not used (session) */}
                        <Form.Group className="mb-3" controlId="rememberMeCheckbox">
                            <Form.Check type="checkbox" label="Remember Me (no function)"/>
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