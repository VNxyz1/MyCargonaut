import { Conversation } from "../interfaces/Message.ts";

export const getAllMessages = async () => {
  try {
    const res = await fetch('/message');
    if (res.ok) {
      const data = await res.json();
      return data.conversations as Conversation[]
    }
  } catch (e) {
    console.error(e)
  }
}


export const getUnreadMessages = async () => {
  try {
    const res = await fetch('/message/unread');
    if (res.ok) {
      const data = await res.json();
      return data.conversations as Conversation[]
    }
  } catch (e) {
    console.error(e)
  }
}

export const postMessage = async (receiverId: number, message: string) => {
  const data: PostMessageData = {receiverId: receiverId, message: message, timestamp: new Date().toISOString()}
  try {
    const res = await fetch('/message', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (e) {
    console.error(e)
  }
}

interface PostMessageData {
  receiverId: number;
  message: string;
  timestamp: string;
}