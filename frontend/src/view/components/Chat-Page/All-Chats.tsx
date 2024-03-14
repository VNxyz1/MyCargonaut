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
    <>
      {chats.length !== 0 ?
        <h3>Chats</h3>
        : <></>
      }
      <ListGroup className='mb-3' style={{ minWidth: "100%", overflow: 'auto' }}>
        {chats.map((c) => (
          <ListGroup.Item className='d-flex justify-content-between' style={{ minWidth: "100%"}} onClick={()=> setSelectedChat(c.conversationId)}>
            <span><strong>{c.conversationPartnerName}</strong></span>
            {unreadMessages(c.conversationId) > 0 ?
              <span className='unread-message-badge'>{unreadMessages(c.conversationId)}</span> :
              <></>
            }
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}

export default AllChats;