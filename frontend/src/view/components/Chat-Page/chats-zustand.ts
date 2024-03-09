import { create } from 'zustand';
import { Conversation } from '../../../interfaces/Message.ts';

type Store = {
  chats: Conversation[]
  selectedChatId: number
  setChats: (conversations: Conversation[]) => void
}

export const chatStore = create<Store>()((set) => ({
  chats: [],
  selectedChatId: 0,
  setChats: (conversations) => set(() => ({ chats: conversations })),
}))