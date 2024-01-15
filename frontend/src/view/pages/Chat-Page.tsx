import { Col, Container, Row } from "react-bootstrap";
import OfferingsAndRequests from "../components/Chat-Page/Offerings-And-Requests.tsx";
import { getAllMessages } from "../../services/messageService.ts";
import { Conversation } from "../../interfaces/Message.ts";
import { useEffect, useState } from "react";


function ChatPage () {

  // @ts-ignore wird noch gebraucht
  const [chats, setChats] = useState<Conversation[]>([]);

  const getChats = async () => {
    const chats = await getAllMessages();
    if (chats) {
      setChats(chats);
    }
  }

  useEffect(() => {
    (async ()=> {
      await getChats();
    })()
  }, []);



  return (
    <Container fluid="md" style={{ minHeight: "70vh" }}>
        <Row className="d-flex justify-content-center mb-4">
          <Col md={3} className="d-flex justify-content-center justify-content-xl-end">

          </Col>
          <Col md={8} className="d-flex justify-content-center justify-content-xl-start">
          </Col>
        </Row>
      <Row className='mb-4'>
        <Col>
          <OfferingsAndRequests/>
        </Col>
      </Row>
    </Container>
  );
}

export default ChatPage