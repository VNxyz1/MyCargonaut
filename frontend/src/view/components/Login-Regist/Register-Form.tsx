import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {InputGroup} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../../AuthContext";

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
    const [ageError, setAgeError] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState<{ p1: string; p2: string }>({p1: "", p2: ""});
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const [isEqualPassword, setisEqualPassword] = useState<string | null>(null);
    const {login} = useAuth();
    const navigate = useNavigate();
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

        if (!isOldEnough()) {
            console.error('Die Person ist nicht 18 Jahre alt.');
            return
        }

        if (passwordErrors.length != 0) {
            console.error('Passwort erfüllt nicht die anforderungen');
            return
        }

        if (form.checkValidity() === false) {
            event.stopPropagation();
        }

        if (form.checkValidity() === true) {
            registerData.password = checkPasswords();
            if (registerData.password.trim() === "") {
                console.error('Passwörter ungelich!');
                return
            }
            const res = await postUser();
            if (res) {

                console.log(res.message);
                setFeedback(res.message);

                if (res.successful) {

                    const res = await loginUser();
                    if (res) {
                        console.log(res.message);
                        setFeedback(res.message);

                        if (res.successful) {
                            login();
                            navigate('/profil');
                        }
                    }

                }
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

            if (response) {
                const data = await response.json();
                console.log(data);
                if (data.ok) {
                    return {successful: true, message: data.message}
                } else {
                    return {successful: false, message: data.message}
                }
            } else {
                console.error("PROBLEM")
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }


    const loginUser = async () => {
        console.log("ZEIT ZUM LOGIN")
        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    eMail: registerData.eMail,
                    password: registerData.password
                }),
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
            console.log("gleich");
            setisEqualPassword(null);
            return passwordValidation.p1
        } else {
            console.log("ungleich");
            setisEqualPassword("Die Passwörter sind ungleich.");
            return "";
        }
    }


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


    const validatePasswordConditions = (password: string) => {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push("Passwort muss mindestens 8 Zeichen lang sein.");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Passwort muss mindestens einen Kleinbuchstaben enthalten.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Passwort muss mindestens einen Großbuchstaben enthalten.");
        }
        if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(password)) {
            errors.push("Passwort muss mindestens ein Sonderzeichen enthalten.");
        }
        setPasswordErrors(errors);
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
                                onBlur={() => isOldEnough()}
                                isInvalid={!!ageError}
                            />
                            {ageError && (<Form.Text style={{color: 'red'}}>{ageError}</Form.Text>)}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerPassword">
                            <InputGroup>
                                <Form.Control
                                    required
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Passwort"
                                    onChange={(event) => {
                                        setPasswordValidation({
                                            ...passwordValidation,
                                            p1: event.target.value,
                                        });
                                        validatePasswordConditions(event.target.value);
                                    }}
                                    isInvalid={passwordErrors && passwordErrors.length > 0}
                                />
                                <InputGroup.Text>
                                    <i
                                        className={`icon-eye${passwordVisible ? "-slash" : ""}`}
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        style={{cursor: "pointer"}}
                                    />
                                </InputGroup.Text>
                            </InputGroup>
                            {passwordErrors &&
                                passwordErrors.map((error, index) => (
                                    <div key={index} >
                                        <Form.Text style={{color: 'red'}}>{error}</Form.Text>
                                    </div>
                                ))}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerPasswordRepeat">
                            <InputGroup>
                                <Form.Control
                                    required
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Passwort wiederholen"
                                    onChange={(event) => {
                                        setPasswordValidation({
                                            ...passwordValidation,
                                            p2: event.target.value,
                                        });
                                    }}
                                />
                                <InputGroup.Text
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    style={{cursor: "pointer"}}
                                >
                                    <i className={`icon-eye${passwordVisible ? "-slash" : ""}`}/>
                                </InputGroup.Text>
                            </InputGroup>
                            {isEqualPassword && (<Form.Text style={{color: 'red'}}>{isEqualPassword}</Form.Text>)}
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="dataPolicyCheck">
                            <Form.Check type="checkbox" label={
                                <span>Mit der Anmeldung bestätige ich, dass ich die <Link to="/privacy" target="_blank" rel="noopener noreferrer">Datenschutzhinweise </Link> akzeptiere und mindestens 18 Jahre alt bin. </span>
                            } required/>
                        </Form.Group>

                        {!feedback ?
                            <></>
                            :
                            <div>
                                <Form.Text style={{color: 'red'}}>
                                    {feedback}
                                </Form.Text>
                            </div>
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