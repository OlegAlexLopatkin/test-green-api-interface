export const Message = {
  EXTENDED_TEXT_MESSAGE: "extendedTextMessage",
  TEXT_MESSAGE: "textMessage",
} as const;

export type MessageType = (typeof Message)[keyof typeof Message];
