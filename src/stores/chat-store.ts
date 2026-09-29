import { makeAutoObservable, reaction } from "mobx";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

import contactsStore from "src/stores/contacts-store";
import phoneStore from "src/stores/phone-store";

import { fetchDelete, fetchGet, fetchPost } from "src/api";
import type { ChatMessage, MessageResponse, Notification } from "src/types";
import {
  API_URL,
  ChatMessageType,
  MessageType,
  TextErrors,
  ToastIds,
  Webhook,
} from "src/constants";

class ChatStore {
  isLoading = false;
  messageInputValue = "";
  messages: ChatMessage[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => phoneStore.chatId,
      () => {
        this.setMessageInputValue("");
        this.setMessages([]);
      },
    );
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setMessageInputValue(messageInputValue: string) {
    this.messageInputValue = messageInputValue;
  }

  setMessages(messages: ChatMessage[]) {
    this.messages = messages;
  }

  get isMessageValid() {
    return !!this.messageInputValue.trim();
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
        const { body, receiptId } = data;

        if (
          body.typeWebhook === Webhook.INCOMING_MESSAGE_RECEIVED &&
          body.messageData?.typeMessage === MessageType.TEXT_MESSAGE
        ) {
          const text = body.messageData.textMessageData?.textMessage ?? "";
          const timestamp = body.timestamp * 1000;

          this.addMessage({
            id: body.idMessage,
            text,
            timestamp,
            type: ChatMessageType.INCOME,
          });
        } else if (
          body.typeWebhook === Webhook.OUTGOING_MESSAGE_RECEIVED &&
          body.messageData?.typeMessage === MessageType.TEXT_MESSAGE
        ) {
          const text = body.messageData.textMessageData?.textMessage ?? "";
          const timestamp = body.timestamp * 1000;
          this.addMessage({
            id: body.idMessage,
            text,
            timestamp,
            type: ChatMessageType.OUTCOME,
          });
        } else if (
          body.typeWebhook === Webhook.OUTGOING_API_MESSAGE_RECEIVED &&
          body.messageData?.typeMessage === MessageType.EXTENDED_TEXT_MESSAGE
        ) {
          const text = body.messageData.extendedTextMessageData?.text ?? "";
          const timestamp = body.timestamp * 1000;
          this.addMessage({
            id: body.idMessage,
            text,
            timestamp,
            type: ChatMessageType.OUTCOME,
          });
        }

        await fetchDelete(
          `${API_URL}/waInstance${contactsStore.idInstance}/deleteNotification/${contactsStore.apiTokenInstance}/${receiptId}`,
        );
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (e) {
      console.log(e);
      toast.error(TextErrors[ToastIds.ERROR_EXECUTING_REQUEST], {
        toastId: ToastIds.ERROR_EXECUTING_REQUEST,
      });
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  async sendMessage() {
    if (!this.isMessageValid) {
      return;
    }

    try {
      this.setIsLoading(true);
      await fetchPost<MessageResponse>(
        `${API_URL}/waInstance${contactsStore.idInstance}/sendMessage/${contactsStore.apiTokenInstance}`,
        {
          chatId: phoneStore.chatId,
          message: this.messageInputValue.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        },
      );
      this.setMessageInputValue("");
    } catch (e) {
      if (e instanceof AxiosError && e.status === 403) {
        toast.error(TextErrors[ToastIds.YOUR_ACCOUNT_IS_SUSPEND], {
          toastId: ToastIds.YOUR_ACCOUNT_IS_SUSPEND,
        });
      } else {
        toast.error(TextErrors[ToastIds.SOMETHING_WENT_WRONG], {
          toastId: ToastIds.SOMETHING_WENT_WRONG,
        });
      }
    } finally {
      this.setIsLoading(false);
    }
  }
}

export default new ChatStore();
