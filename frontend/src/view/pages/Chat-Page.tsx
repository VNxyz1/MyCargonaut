import { Col, Container, Row } from 'react-bootstrap';
import OfferingsAndRequests from '../components/Chat-Page/offeringsAndRequests/Offerings-And-Requests.tsx';
import { getAllMessages, getUnreadMessages } from '../../services/messageService.ts';
import { useEffect } from 'react';
import { chatStore } from '../components/Chat-Page/chats-zustand.ts';
import AllChats from '../components/Chat-Page/All-Chats.tsx';
import SingleChat from '../components/Chat-Page/Single-Chat.tsx';
import IOR_Sidebar from '../components/Chat-Page/offeringsAndRequests/IncommingOffsAndReqs-Sidebar.tsx';


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
        <Col style={{ maxHeight: '30rem', minHeight: '30rem', overflowY: 'scroll' }} xs={3} className="justify-content-end">
            <AllChats />
            <IOR_Sidebar/>
        </Col>
        <Col xs={8} className={'d-flex justify-content-start justify-content-md-start'}>
          <SingleChat/>
        </Col>
      </Row>
      <div className="mb-4 container">
          <OfferingsAndRequests />
      </div>
    </Container>
  );
}

export default ChatPage;