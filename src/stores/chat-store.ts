import { makeAutoObservable } from "mobx";
import { API_URL } from "../constants/common";

import contactsStore from "./contacts-store";
import phoneStore from "./phone-store";

import { del, get, post } from "../api";

interface IMessage {
  id: number;
  type: "income" | "outcome";
  senderName: string;
  text: string;
}

class ChatStore {
  isLoading = false;
  message = "";
  messages: IMessage[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setMessage(message: string) {
    this.message = message;
  }

  setMessages(messages: IMessage[]) {
    this.messages = messages;
  }

  addMessage(message: IMessage) {
    const isMessageExist = !!this.messages.find(({ id }) => id === message.id);
    if (isMessageExist) {
      return;
    }
    this.setMessages([...this.messages, message]);
  }

  async getNotification() {
    try {
      const data = await get(
        `${API_URL}/waInstance${contactsStore.idInstance}/receiveNotification/${contactsStore.apiTokenInstance}`,
      );

      if (data) {
        // @ts-expect-error error
        const { receiptId, body } = data;
        if (
          body.typeWebhook === "incomingMessageReceived" &&
          body.messageData?.typeMessage === "textMessage"
        ) {
          const senderName = body.senderData.senderName;
          const text = body.messageData.textMessageData.textMessage;

          this.addMessage({
            id: receiptId,
            type: "income",
            senderName: senderName,
            text,
          });
        } else if (
          body.typeWebhook === "outgoingMessageReceived" &&
          body.messageData?.typeMessage === "textMessage"
        ) {
          const text = body.messageData.textMessageData.textMessage;
          this.addMessage({
            id: receiptId,
            type: "outcome",
            senderName: "Вы",
            text,
          });
        } else if (
          body.typeWebhook === "outgoingAPIMessageReceived" &&
          body.messageData?.typeMessage === "extendedTextMessage"
        ) {
          const text = body.messageData.extendedTextMessageData.text;
          this.addMessage({
            id: receiptId,
            type: "outcome",
            senderName: "Вы",
            text,
          });
        }

        await del(
          // @ts-expect-error error
          `${API_URL}/waInstance${contactsStore.idInstance}/deleteNotification/${contactsStore.apiTokenInstance}/${data.receiptId}`,
          {
            method: "DELETE",
          },
        );
      }
    } catch (e) {
      console.error(e);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  async sendMessage() {
    if (!this.message.trim()) {
      return;
    }

    try {
      this.setIsLoading(true);
      await post(
        `${API_URL}/waInstance${contactsStore.idInstance}/sendMessage/${contactsStore.apiTokenInstance}`,
        {
          chatId: phoneStore.chatId,
          message: this.message.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        },
      );
      this.setMessage("");
    } catch (e) {
      console.log(e);
    } finally {
      this.setIsLoading(false);
    }
  }
}

export default new ChatStore();
