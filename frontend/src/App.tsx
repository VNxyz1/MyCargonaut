import './App.css'
import RoutesComponent from "./App-Router-Module.tsx";
import { useEffect } from 'react';
import { socket, socketStore } from './services/sockets.ts';
import { useAuth } from './services/authService.tsx';
import { getLoggedInUser } from './services/userService.tsx';
import { chatStore } from './view/components/Chat-Page/chats-zustand.ts';
import { getAllMessages, getUnreadMessages } from './services/messageService.ts';
import { reqAndOffStore } from './view/components/Chat-Page/offeringsAndRequests-zustand.ts';
import { getOfferings } from './services/tripRequestService.ts';
import { getTransitRequests } from './services/offerService.tsx';

function App() {

  const {setIsConnected } = socketStore();
  const {setChats, sortByDateDesc, setUnreadChats } = chatStore();
  const { isAuthenticated} = useAuth();
  const { setIncomingOfferings, setSentOfferings, setSentTransitRequests, setIncomingTransitRequests} = reqAndOffStore();

  const handleUnreadMessages = async () => {
    await getReqsAndOffs();

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
      await getReqsAndOffs();

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


  const getReqsAndOffs = async () => {
    const {incomingOfferings, sentOfferings} = await getOfferings();
    setIncomingOfferings(incomingOfferings);
    setSentOfferings(sentOfferings);

    const {incomingTransitRequests, sentTransitRequests} = await getTransitRequests();
    setIncomingTransitRequests(incomingTransitRequests);
    setSentTransitRequests(sentTransitRequests);
  }



  return (
    <>
      <RoutesComponent/>
    </>
  )
}

export default App
