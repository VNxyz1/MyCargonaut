import { ListGroup } from 'react-bootstrap';
import { chatStore } from './chats-zustand.ts';
import { CSSProperties, useEffect } from 'react';

const unreadConversation: CSSProperties = {
  backgroundColor: 'red'
}

const conversation: CSSProperties = {
  backgroundColor: 'white'
}

function AllChats() {

  const { chats, setSelectedChat, unreadConversations } = chatStore();

  useEffect(() => {
    if (chats.length !== 0) {
      setSelectedChat(chats[0].conversationId);
    }
  }, [chats]);

  const unread = (conversationId: number) => {
    if(unreadConversations) {
      const found = unreadConversations.find((uC) => uC.conversationId == conversationId);
      console.log("du wurdest als ungelesen erkannt?" + found !== undefined)
      return found !== undefined;
    }
  }

  return (
    <ListGroup style={{ overflow: 'auto' }}>
      {chats.map((c) => (
        <ListGroup.Item onClick={()=> setSelectedChat(c.conversationId)} style={unread(c.conversationId) ? unreadConversation : conversation}>
          <h3>{c.conversationPartnerName}</h3>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default AllChats;