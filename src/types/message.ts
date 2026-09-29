import type { ChatMessageType } from "src/shared";

export interface MessageResponse {
  idMessage: string;
}

export interface ChatMessage {
  id: string;
  type: ChatMessageType;
  text: string;
  timestamp: number;
}
