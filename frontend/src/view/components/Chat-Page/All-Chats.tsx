import { ListGroup } from "react-bootstrap";
import { chatStore } from './chats-zustand.ts';

function AllChats() {

  const {chats} = chatStore();


  return (
    <ListGroup style={{overflow: 'auto'}}>
      {chats.map((c)=> (
        <ListGroup.Item>
          <h3>{c.conversationPartnerName}</h3>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default AllChats