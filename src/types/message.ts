export interface MessageResponse {
  idMessage: string;
}

export interface ChatMessage {
  id: number;
  senderName: string;
  type: "income" | "outcome";
  text: string;
}
