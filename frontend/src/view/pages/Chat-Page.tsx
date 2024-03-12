import { Col, Container, Row } from 'react-bootstrap';
import OfferingsAndRequests from '../components/Chat-Page/Offerings-And-Requests.tsx';
import { getAllMessages, getUnreadMessages } from '../../services/messageService.ts';
import { useEffect } from 'react';
import { chatStore } from '../components/Chat-Page/chats-zustand.ts';
import AllChats from '../components/Chat-Page/All-Chats.tsx';
import SingleChat from '../components/Chat-Page/Single-Chat.tsx';


function ChatPage() {

  const { setChats, sortByDateDesc, setUnreadChats } = chatStore();

  const getChats = async () => {
    const chats = await getAllMessages();
    const unreadMessagesCount = await getUnreadMessages();
    if (chats && unreadMessagesCount) {
      setUnreadChats(unreadMessagesCount);
      setChats(chats);
      sortByDateDesc();
      return;
    }
    setChats([]);
    setUnreadChats({ conversations: [], totalUnreadMessages: 0 });

  };

  useEffect(() => {
    (async () => {
      await getChats();
    })();
  }, []);


  return (
    <Container fluid="md" style={{ minHeight: '70vh' }}>
      <Row className="d-flex justify-content-center my-4">
        <Col md={3} className="d-flex justify-content-center justify-content-xl-end">
          <AllChats />
        </Col>
        <Col md={8} className="d-flex justify-content-center justify-content-xl-start">
          <SingleChat />
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