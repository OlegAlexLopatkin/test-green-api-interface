import { makeAutoObservable } from "mobx";

import appStore from "src/stores/app-store";
import contactsStore from "src/stores/contacts-store";

import { fetchPost } from "src/api";
import { API_URL } from "src/constants";
import type { AccountVerification } from "src/types";

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

        const { chatId, exist } = await fetchPost<AccountVerification>(
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
