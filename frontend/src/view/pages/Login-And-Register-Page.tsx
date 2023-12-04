import {Col, Container, Row, Image} from "react-bootstrap";
import LoginForm from "../components/Login-Form.tsx";
import RegisterForm from "../components/Register-Form.tsx";
import logo from "../../assets/semi_androidMyCargonautmdpi.png"

function LoginAndRegisterPage() {

    return (
        <div id="login_page">
        <Container className="mt-4 content-container">
            <Row className="d-flex justify-content-center mb-5">
                <Image style={{height: "5rem", width: "auto"}} src={logo} alt="Logo" fluid />
            </Row>
            <Row>
                <Col className="d-flex justify-content-end">
                    <LoginForm/>
                </Col>
                <Col className="d-flex justify-content-start">
                    <RegisterForm/>
                </Col>
            </Row>
        </Container>
        </div>
    );
}
export default LoginAndRegisterPage