import {Col, Container, Row, Image} from "react-bootstrap";
import LoginForm from "../components/Login-Regist/Login-Form.tsx";
import RegisterForm from "../components/Login-Regist/Register-Form.tsx";
import logo from "../../assets/semi_androidMyCargonautmdpi.png"
import {AlertProps} from "../../interfaces/AlertProps";

function LoginAndRegisterPage({ handleShowAlert }: AlertProps ) {

    return (
        <div id="login_page">
        <Container className="mt-4 content-container">
            <Row className="d-flex justify-content-center mb-5">
                <Image style={{height: "5rem", width: "auto"}} src={logo} alt="Logo" fluid />
            </Row>
            <Row>
                <Col className="d-flex justify-content-xl-end justify-content-center mb-4 mb-xl-0">
                    <LoginForm handleShowAlert={handleShowAlert}/>
                </Col>
                <Col className="d-flex justify-content-xl-start justify-content-center">
                    <RegisterForm handleShowAlert={handleShowAlert}/>
                </Col>
            </Row>
        </Container>
        </div>
    );
}
export default LoginAndRegisterPage