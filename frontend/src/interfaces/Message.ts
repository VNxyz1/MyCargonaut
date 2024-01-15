export interface Conversation {
  conversationId: number;

  conversationPartnerId: number;

  conversationPartnerName: string;

  messages: Message[];
}

export interface Message {
  senderId: number;

  conversationId: number;

  message: string;

  read: boolean;
}