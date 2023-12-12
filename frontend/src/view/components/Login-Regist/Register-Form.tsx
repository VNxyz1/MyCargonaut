import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {useState} from "react";
import {Link} from "react-router-dom";

interface RegisterDataProps {
    eMail: string;
    firstName: string;
    lastName: string;
    password: string;
    birthday: Date | undefined;
}

function RegisterForm() {
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState<string | undefined>(undefined);
    const [passwordValidation, setPasswordValidation] = useState({p1: "", p2: ""});
    const [registerData, setRegisterData] = useState<RegisterDataProps>({
        birthday: undefined,
        firstName: "",
        lastName: "",
        eMail: "",
        password: ""
    });


    const handleSubmit = async (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (isOldEnough()) {
            console.log('Die Person ist 18 Jahre oder älter. Formular abschicken...');
        } else {
            console.error('Die Person ist nicht 18 Jahre alt.');
        }

        if (form.checkValidity() === false) {
            event.stopPropagation();
        }

        if (form.checkValidity() === true) {
            registerData.password = checkPasswords();
            if (registerData.password.trim() === "") {
                setFeedback("Passwörter müssen übereinstimmen");
                return
            }
            const res = await postUser();
            if (res) {
                console.log(res.message);
                setFeedback(res.message);
            }
        }
        setValidated(true);
    };

    const handleFormChange = (prop: string, value: string) => {
        setRegisterData({
            ...registerData,
            [prop]: value
        })
    }


    const postUser = async () => {
        try {
            const response = await fetch("/user", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(registerData),
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

    const checkPasswords = () => {
        if (passwordValidation.p1 === passwordValidation.p2) {
            return passwordValidation.p1
        }
        return ""
    }
    const [ageError, setAgeError] = useState<string | null>(null);

    const isOldEnough = () => {
        const birthdate = new Date(registerData.birthday as any);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthdate.getFullYear();

        if (age < 18) {
            setAgeError("Du musst mindestens 18 Jahre alt sein.");
            return false;
        } else {
            setAgeError(null);
            return true;
        }
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
                                    placeholder="Vorname"
                                    onChange={(event) => handleFormChange("firstName", event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="mb-3" controlId="registerLastName">
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Nachname"
                                    onChange={(event) => handleFormChange("lastName", event.target.value)}
                                />
                            </Form.Group>
                        </Row>
                        <Form.Group className="mb-3" controlId="registerEmail">
                            <Form.Control
                                required
                                type="email"
                                placeholder="E-Mail"
                                onChange={(event) => handleFormChange("eMail", event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="registerBirthdate">
                            <Form.Control
                                required
                                type="date"
                                placeholder="Geburtsdatum"
                                onChange={(event) => {
                                    handleFormChange('birthday', event.target.value);
                                    isOldEnough();
                                }}
                                onBlur={() => isOldEnough()} // Füge diese Zeile hinzu
                                isInvalid={!!ageError}
                            />
                            {ageError && (<Form.Text style={{color: 'red'}}>{ageError}</Form.Text>)}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="registerPassword">
                            <Form.Control
                                required
                                type="password"
                                placeholder="Passwort"
                                onChange={(event) => setPasswordValidation({
                                    ...passwordValidation,
                                    p1: event.target.value
                                })}
                            />

                        </Form.Group>
                        <Form.Group className="mb-3" controlId="registerPasswordRepeat">
                            <Form.Control
                                required
                                type="password"
                                placeholder="Passwort wiederholen"
                                onChange={(event) => setPasswordValidation({
                                    ...passwordValidation,
                                    p2: event.target.value
                                })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="dataPolicyCheck">
                            <Form.Check type="checkbox" label={
                                <span>Mit der Anmeldung bestätige ich, dass ich die <Link to="/privacy" target="_blank" rel="noopener noreferrer">Datenschutzhinweise </Link> akzeptiere und mindestens 18 Jahre alt bin. </span>
                            } required/>
                        </Form.Group>

                        {!feedback ?
                            <></>
                            :
                            <p style={{fontStyle: "italic"}}>a
                                {feedback}
                            </p>
                        }
                        <Button type="submit" className="mainButton">
                            sign in
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );

}

export default RegisterForm