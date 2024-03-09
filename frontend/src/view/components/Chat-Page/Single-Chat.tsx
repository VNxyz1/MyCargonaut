import { chatStore } from './chats-zustand.ts';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Message } from '../../../interfaces/Message.ts';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons/faPaperPlane'

function SingleChat () {
  const {selectedChat} = chatStore();

  return (
    <Container>
      <Row>
        {selectedChat.messages.map((message) => (
          <Row className={message.senderId == selectedChat.conversationPartnerId ? 'justify-content-start' : 'justify-content-end'}>
              <MessageComp message={message}/>
          </Row>
        ))}
      </Row>
      <Row>
        <Form className='w-100'>
          <Row>
            <Col>
              <Form.Control className='w-100' type="text" placeholder="Nachricht..."/>
            </Col>
            <Col sm='auto'>
              <Button className="mainButton w-100">
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
      <Card className='w-auto mb-3 mx-3'>
        <Card.Body>
          {props.message.message}
        </Card.Body>
        <Card.Footer>{props.message.timestamp}</Card.Footer>
      </Card>
  );
}


export default SingleChat