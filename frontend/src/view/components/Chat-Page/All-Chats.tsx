import { ListGroup } from 'react-bootstrap';
import { chatStore } from './chats-zustand.ts';
import { useEffect } from 'react';

function AllChats() {

  const { chats, setSelectedChat } = chatStore();

  useEffect(() => {
    if (chats.length !== 0) {
      setSelectedChat(chats[0].conversationId);
    }
  }, [chats]);

  return (
    <ListGroup style={{ overflow: 'auto' }}>
      {chats.map((c) => (
        <ListGroup.Item onClick={()=> setSelectedChat(c.conversationId)}>
          <h3>{c.conversationPartnerName}</h3>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default AllChats;