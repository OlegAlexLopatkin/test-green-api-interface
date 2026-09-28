export interface MessageResponse {
  idMessage: string;
}

export interface ChatMessage {
  id: number;
  type: "income" | "outcome";
  text: string;
  timestamp: number;
}
