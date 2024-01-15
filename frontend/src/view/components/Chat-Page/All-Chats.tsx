import { Conversation } from "../../../interfaces/Message.ts";
import { ListGroup } from "react-bootstrap";

function AllChats (
  props: {
    chats: Conversation[]
  }
) {



  return (
    <ListGroup style={{overflow: 'auto'}}>
      {props.chats.map((c)=> (
        <ListGroup.Item>
          <h3>{c.conversationPartnerName}</h3>
        </ListGroup.Item>
      ))}

    </ListGroup>
  );
}

export default AllChats