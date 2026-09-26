import { makeAutoObservable } from "mobx";
import { API_URL } from "src/constants/common";

import contactsStore from "src/stores/contacts-store";
import phoneStore from "src/stores/phone-store";

import { fetchDelete, fetchGet, fetchPost } from "src/api";
import type { ChatMessage, MessageResponse, Notification } from "src/types";
import { Message, Webhook } from "src/constants";

class ChatStore {
  isLoading = false;
  message = "";
  messages: ChatMessage[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setMessage(message: string) {
    this.message = message;
  }

  setMessages(messages: ChatMessage[]) {
    this.messages = messages;
  }

  addMessage(message: ChatMessage) {
    const isMessageExist = !!this.messages.find(({ id }) => id === message.id);
    if (isMessageExist) {
      return;
    }
    this.setMessages([...this.messages, message]);
  }

  async getNotification() {
    try {
      const data = await fetchGet<Notification>(
        `${API_URL}/waInstance${contactsStore.idInstance}/receiveNotification/${contactsStore.apiTokenInstance}`,
      );

      if (data) {
        const { receiptId, body } = data;

        if (
          body.typeWebhook === Webhook.INCOMING_MESSAGE_RECEIVED &&
          body.messageData?.typeMessage === Message.TEXT_MESSAGE
        ) {
          const senderName = body.senderData.senderName;
          const text = body.messageData.textMessageData?.textMessage ?? "";

          this.addMessage({
            id: receiptId,
            type: "income",
            senderName: senderName,
            text,
          });
        } else if (
          body.typeWebhook === Webhook.OUTGOING_MESSAGE_RECEIVED &&
          body.messageData?.typeMessage === Message.TEXT_MESSAGE
        ) {
          const text = body.messageData.textMessageData?.textMessage ?? "";
          this.addMessage({
            id: receiptId,
            type: "outcome",
            senderName: "Вы",
            text,
          });
        } else if (
          body.typeWebhook === Webhook.OUTGOING_API_MESSAGE_RECEIVED &&
          body.messageData?.typeMessage === Message.EXTENDED_TEXT_MESSAGE
        ) {
          const text = body.messageData.extendedTextMessageData?.text ?? "";
          this.addMessage({
            id: receiptId,
            type: "outcome",
            senderName: "Вы",
            text,
          });
        }

        await fetchDelete(
          `${API_URL}/waInstance${contactsStore.idInstance}/deleteNotification/${contactsStore.apiTokenInstance}/${data.receiptId}`,
        );
      }
    } catch (e) {
      console.error(e);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  async sendMessage() {
    const message = this.message.trim();
    if (!message) {
      return;
    }

    try {
      this.setIsLoading(true);
      await fetchPost<MessageResponse>(
        `${API_URL}/waInstance${contactsStore.idInstance}/sendMessage/${contactsStore.apiTokenInstance}`,
        {
          chatId: phoneStore.chatId,
          message,
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
