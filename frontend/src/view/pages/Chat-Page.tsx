import { Col, Container, Row } from "react-bootstrap";
import AllChats from "../components/Chat-Page/All-Chats.tsx";
import SingleChat from "../components/Chat-Page/Single-Chat.tsx";
import OfferingsAndRequests from "../components/Chat-Page/Offerings-And-Requests.tsx";


function ChatPage () {


  return (
    <Container fluid="md">
        <Row className="d-flex justify-content-center">
          <Col md={3} className="d-flex justify-content-center justify-content-xl-end">
            <AllChats/>
          </Col>
          <Col md={8} className="d-flex justify-content-center justify-content-xl-start">
            <SingleChat/>
          </Col>
        </Row>
      <Row>
        <Col>
          <OfferingsAndRequests/>
        </Col>
      </Row>
    </Container>
  );
}

export default ChatPage