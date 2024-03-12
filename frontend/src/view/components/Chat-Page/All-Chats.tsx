import { ListGroup } from 'react-bootstrap';
import { chatStore } from './chats-zustand.ts';
import { useEffect } from 'react';


function AllChats() {

  const { chats, setSelectedChat, unreadConversations } = chatStore();

  useEffect(() => {
    if (chats.length !== 0) {
      setSelectedChat(chats[0].conversationId);
    }
  }, [chats]);

  const unreadMessages = (conversationId: number): number => {
    if(unreadConversations) {
      const found = unreadConversations.find((uC) => uC.conversationId == conversationId);
      if (found) {
        return found.unreadMessages;
      }
    }
    return 0;
  }

  return (
    <ListGroup style={{ overflow: 'auto' }}>
      {chats.map((c) => (
          <ListGroup.Item onClick={()=> setSelectedChat(c.conversationId)}>
            <h3>{c.conversationPartnerName}</h3>
            {unreadMessages(c.conversationId) > 0 ?
              <span className='unread-message-badge'>{unreadMessages(c.conversationId)}</span> :
              <></>
            }
          </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default AllChats;