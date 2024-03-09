import { create } from 'zustand';
import { Conversation, Message } from '../../../interfaces/Message.ts';

type Store = {
  chats: Conversation[]
  selectedChat: Conversation
  setChats: (conversations: Conversation[]) => void
  setSelectedChatId: (id: number) => void
  sortByDateDesc: () => void
}

export const chatStore = create<Store>()((set) => ({
  chats: [],
  selectedChat: {
    conversationId: 0,
    conversationPartnerId: 0,
    conversationPartnerName: '',
    messages: [],
  },
  setChats: (conversations) => set(() => ({ chats: conversations })),
  setSelectedChatId: (id) => set((state) => ({ selectedChat: findConversation(id, state.chats) })),
  sortByDateDesc: () => set((store) => ({ chats: sortByDateDesc(store.chats) })),
}));

function sortByDateDesc(chats: Conversation[]): Conversation[] {
  return chats.sort((a, b) => {
    const newestMessageA = findNewestMessage(a.messages);
    const newestMessageB = findNewestMessage(b.messages);
    const dateA = new Date(newestMessageA.timestamp);
    const dateB = new Date(newestMessageB.timestamp);
    return dateA.getTime() - dateB.getTime();
  });
}


function findNewestMessage(messages: Message[]): Message {
  let newest = messages[0];
  for (const m of messages) {
    const date = new Date(m.timestamp);
    const newestDate = new Date(newest.timestamp);
    if (date > newestDate) {
      newest = m;
    }
  }
  return newest;
}

function findConversation(id: number, chats: Conversation[]) {
  if (chats.length == 0) {
    return {
      conversationId: 0,
      conversationPartnerId: 0,
      conversationPartnerName: '',
      messages: [],
    };
  }

  const conversation = chats.find((c) => {
    return c.conversationId == id;
  });

  if (conversation == undefined) {
    return chats[0];
  }

  return conversation;
}