import { makeAutoObservable } from "mobx";
import { API_URL } from "../constants/common";
import appStore from "./app-store";
import contactsStore from "./contacts-store";
import { post } from "../api";

class PhoneStore {
  chatId = "";
  isLoading = false;
  phone = "";

  constructor() {
    makeAutoObservable(this);
  }

  setChatId(chatId: string) {
    this.chatId = chatId;
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setPhone(phone: string) {
    this.phone = phone.replace(/\D/, "");
  }

  validatePhone() {
    return this.phone.length === 11;
  }

  async nextButtonClickHandler() {
    if (this.validatePhone()) {
      this.setIsLoading(true);
      try {
        const body = {
          phoneNumber: +this.phone,
        };
        // @ts-expect-error abc
        const { exist, chatId } = await post(
          `${API_URL}/waInstance${contactsStore.idInstance}/checkAccount/${contactsStore.apiTokenInstance}`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (exist) {
          this.setChatId(chatId);
          appStore.nextStage();
        } else {
          this.setChatId("");
        }
      } catch (e) {
        console.log(e);
        this.setChatId("");
      } finally {
        this.setIsLoading(false);
      }
    }
  }
}

export default new PhoneStore();
