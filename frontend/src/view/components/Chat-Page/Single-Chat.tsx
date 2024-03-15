import { chatStore } from './chats-zustand.ts';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Message } from '../../../interfaces/Message.ts';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons/faPaperPlane'
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { getAllMessages, getUnreadMessages, markMessagesRead, postMessage } from '../../../services/messageService.ts';

const chatWindowStyle: CSSProperties = {
  maxHeight: '30rem',
  minHeight: '30rem',
  overflowY: 'scroll'
}

function SingleChat () {
  const {selectedChat, setUnreadChats, setChats, sortByDateDesc } = chatStore();

  const [messageToSend, setMessageToSend] = useState<string>("");
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    setTimeout(()=> {
      scrollToBottom();
    }, 50)
  }, [selectedChat.messages, chatWindowRef]);

  const submitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sent = await postMessage(selectedChat.conversationPartnerId, messageToSend);
    if (sent) {
      getChats();
      setMessageToSend("");
      scrollToBottom();
    }
    return;
  }

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

  const markMessagesAsRead = async () => {
      await markMessagesRead(selectedChat.conversationId);
      const unreadMessages = await getUnreadMessages();
      if (unreadMessages) {
        setUnreadChats(unreadMessages);
      }
  }

  return (
    <Container fluid onClick={markMessagesAsRead} onFocus={markMessagesAsRead}>
      <Row className="mb-3" style={chatWindowStyle} ref={chatWindowRef}>
        {selectedChat.messages.map((message) => (
          <Row
            className={message.senderId == selectedChat.conversationPartnerId ? 'justify-content-start' : 'justify-content-end'}>
            <MessageComp message={message} />
          </Row>
        ))}
      </Row>
      <Row>
        <Form onSubmit={submitMessage} className='w-100'>
          <Row>
            <Col>
              <Form.Control
                onChange={(e) => setMessageToSend(e.target.value)}
                value={messageToSend}
                className='w-100' type="text" placeholder="Nachricht..."/>
            </Col>
            <Col sm='auto'>
              <Button type='submit' className="mainButton w-100">
                <FontAwesomeIcon icon={faPaperPlane}/>
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    </Container>
  );
}

function MessageComp( props: { message: Message }) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const timestamp = () => {
    const date = new Date(props.message.timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    setDate(`${day}.${month}.${year}`);
    setTime(`${hours}:${minutes}`);
  }

  useEffect(() => {
    timestamp()
  }, []);

  return (
      <Card className='w-auto mb-3 mx-3 p-0' style={{maxWidth: '70%'}}>
        <Card.Body className='pe-5'>
            {props.message.message}
        </Card.Body>
        <Card.Footer className='text-end py-0' ><em><small>{date} <strong>{time}</strong></small></em></Card.Footer>
      </Card>
  );
}


export default SingleChat