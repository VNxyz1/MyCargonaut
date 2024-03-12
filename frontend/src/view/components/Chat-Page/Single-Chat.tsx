import { chatStore } from './chats-zustand.ts';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Message } from '../../../interfaces/Message.ts';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons/faPaperPlane'
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { getUnreadMessages, markMessagesRead, postMessage } from '../../../services/messageService.ts';

const chatWindowStyle: CSSProperties = {
  maxHeight: '40rem',
  overflowY: 'scroll'
}

function SingleChat () {
  const {selectedChat, setUnreadChats} = chatStore();

  const [messageToSend, setMessageToSend] = useState<string>("");
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat.messages, chatWindowRef]);

  const submitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sent = await postMessage(selectedChat.conversationPartnerId, messageToSend);
    if (sent) {
      setMessageToSend("");
      scrollToBottom();
    }
    return;
  }

  const markMessagesAsRead = async () => {
    if (selectedChatContainsUnreadMessages()) {
      await markMessagesRead(selectedChat.conversationId);
      const unreadMessages = await getUnreadMessages();
      if (unreadMessages) {
        setUnreadChats(unreadMessages);
      }
    }
  }

  const selectedChatContainsUnreadMessages = (): boolean => {
    return !!selectedChat.messages.find((m) => !m.read);
  }

  return (
    <Container onClick={markMessagesAsRead} onFocus={markMessagesAsRead}>
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

  return (
      <Card className='w-auto mb-3 mx-3' style={{maxWidth: '70%'}}>
        <Card.Body>
          {props.message.message}
        </Card.Body>
        <Card.Footer>{props.message.timestamp}</Card.Footer>
      </Card>
  );
}


export default SingleChat