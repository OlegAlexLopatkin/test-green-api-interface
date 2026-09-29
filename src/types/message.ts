import type { ChatMessageType } from "src/shared";

export interface MessageResponse {
  idMessage: string;
}

export interface ChatMessage {
  id: number;
  type: ChatMessageType;
  text: string;
  timestamp: number;
}
