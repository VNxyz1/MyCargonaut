import { chatStore } from './chats-zustand.ts';
import { Card, InputGroup } from 'react-bootstrap';
import { Message } from '../../../interfaces/Message.ts';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function SingleChat () {
  const {selectedChat} = chatStore();

  return (
    <>
      {selectedChat.messages.map((message) => (
        <MessageComp message={message}/>
      ))}
      <Form>
        <InputGroup>
          <Form.Control type="text" placeholder="Nachricht..."/>
          <Button className="mainButton">
          </Button>
        </InputGroup>
      </Form>
    </>
  );
}

function MessageComp( props: { message: Message }) {

  return (
    <Card>
      <Card.Body>
        {props.message.message}
      </Card.Body>
      <Card.Footer>{props.message.timestamp}</Card.Footer>
    </Card>
  );
}


export default SingleChat