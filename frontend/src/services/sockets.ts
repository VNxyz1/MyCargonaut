import { create } from 'zustand';
import { io } from 'socket.io-client';


type Store = {
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
  unreadMessages: number
  setUnreadMessages: (unreadMessages: number) => void
}


export const socketStore = create<Store>()((set) => ({
  isConnected: false,
  setIsConnected: (connected) => set(() => ({isConnected: connected})),
  unreadMessages: 0,
  setUnreadMessages: (unreadMessages) => set(()=> ({unreadMessages: unreadMessages}))
}));

export const socket = io();
