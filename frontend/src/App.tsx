import './App.css'
import RoutesComponent from "./App-Router-Module.tsx";
import { useEffect } from 'react';
import { socket, socketStore } from './services/sockets.ts';
import { useAuth } from './services/authService.tsx';
import { getLoggedInUser } from './services/userService.tsx';
import { chatStore } from './view/components/Chat-Page/chats-zustand.ts';
import { getAllMessages, getUnreadMessages } from './services/messageService.ts';

function App() {

  const {setIsConnected } = socketStore();
  const {setChats, sortByDateDesc, setUnreadChats } = chatStore();
  const { isAuthenticated} = useAuth();

  const handleUnreadMessages = async () => {
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
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    function onConnect(userId: number) {
      setIsConnected(true);
      socket.emit('userId', {id: userId})
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    (async ()=> {
      const userData = await getLoggedInUser();
      if (userData == null || userData.id == undefined) {
        return;
      }

      onConnect(Number(userData.id));
      socket.on('disconnect', onDisconnect);
      socket.on('unreadMessages', handleUnreadMessages);


    })()

    return () => {
      socket.off('connect', () => onConnect(0));
      socket.off('disconnect', onDisconnect);
      socket.off('unreadMessages', handleUnreadMessages);
    }

  }, [isAuthenticated]);

  return (
    <>
      <RoutesComponent/>
    </>
  )
}

export default App
