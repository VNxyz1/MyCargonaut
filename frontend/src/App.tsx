import './App.css'
import RoutesComponent from "./App-Router-Module.tsx";
import { useEffect } from 'react';
import { socket, socketStore } from './services/sockets.ts';

function App() {

  const {setIsConnected, setUnreadMessages} = socketStore();

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect );
    socket.on('disconnect', onDisconnect);
    socket.on('newMessage', setUnreadMessages);


    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('newMessage', setUnreadMessages);
    }
  }, []);

  return (
    <>
      <RoutesComponent/>
    </>
  )
}

export default App
