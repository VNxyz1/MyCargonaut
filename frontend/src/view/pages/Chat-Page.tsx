import { Col, Container, Row } from 'react-bootstrap';
import OfferingsAndRequests from '../components/Chat-Page/Offerings-And-Requests.tsx';
import { getAllMessages } from '../../services/messageService.ts';
import { useEffect } from 'react';
import { chatStore } from '../components/Chat-Page/chats-zustand.ts';
import AllChats from '../components/Chat-Page/All-Chats.tsx';


function ChatPage() {

  const {setChats, sortByDateDesc} = chatStore();

  const getChats = async () => {
    const chats = await getAllMessages();
    if (chats) {
      setChats(chats);
      sortByDateDesc();
    }
  };

  useEffect(() => {
    (async () => {
      await getChats();
    })();
  }, []);


  return (
    <Container fluid="md" style={{ minHeight: '70vh' }}>
      <Row className="d-flex justify-content-center mb-4">
        <Col md={3} className="d-flex justify-content-center justify-content-xl-end">
          <AllChats/>
        </Col>
        <Col md={8} className="d-flex justify-content-center justify-content-xl-start">
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <OfferingsAndRequests />
        </Col>
      </Row>
    </Container>
  );
}

export default ChatPage;