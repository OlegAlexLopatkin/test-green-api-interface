import { makeAutoObservable } from "mobx";
import { isPossiblePhoneNumber } from "react-phone-number-input";

import appStore from "src/stores/app-store";
import contactsStore from "src/stores/contacts-store";

import { fetchPost } from "src/api";
import { API_URL } from "src/constants";
import type { AccountVerification } from "src/types";

class PhoneStore {
  chatId = "";
  isLoading = false;
  phone: string | undefined;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setChatId(chatId: string) {
    this.chatId = chatId;
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setPhone(phone: string | undefined) {
    this.phone = phone;
  }

  get isValidPhone() {
    return this.phone && isPossiblePhoneNumber(this.phone);
  }

  async nextButtonClickHandler() {
    if (!!this.phone && this.isValidPhone) {
      this.setIsLoading(true);

      try {
        const body = {
          phoneNumber: Number(this.phone.replace(/\D/, "")),
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
