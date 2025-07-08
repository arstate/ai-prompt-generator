
export enum MessageSender {
  USER = 'user',
  AI = 'ai',
}

export type TextMessage = {
  id: string;
  sender: MessageSender;
  type: 'text';
  content: string;
};

export type ImageMessage = {
  id: string;
  sender: MessageSender.AI;
  type: 'image';
  imageUrl: string;
  prompt: string;
};

export type ChatMessage = TextMessage | ImageMessage;
