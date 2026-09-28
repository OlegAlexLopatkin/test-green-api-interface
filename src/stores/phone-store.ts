import { makeAutoObservable } from "mobx";
import {
  formatPhoneNumberIntl,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import type { NavigateFunction } from "react-router";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

import appStore from "src/stores/app-store";
import contactsStore from "src/stores/contacts-store";

import { fetchPost } from "src/api";
import { API_URL, AppRoutes } from "src/constants";
import type { AccountVerification } from "src/types";

class PhoneStore {
  chatId = "";
  formattedPhone = "";
  isLoading = false;
  phone: string | undefined;
  prevPhone: number | undefined;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setChatId(chatId: string) {
    this.chatId = chatId;
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setFormattedPhone(phone: string) {
    this.formattedPhone = phone;
  }

  setPhone(phone: string | undefined) {
    this.phone = phone;
  }

  setPrevPhone(prevPhone?: number) {
    this.prevPhone = prevPhone;
  }

  get isValidPhone() {
    return this.phone && isPossiblePhoneNumber(this.phone);
  }

  async nextButtonClickHandler(navigate: NavigateFunction) {
    if (!!this.phone && this.isValidPhone) {
      this.setIsLoading(true);

      const phoneNumber = Number(this.phone.replace(/\D/, ""));

      if (phoneNumber === this.prevPhone && !!this.chatId) {
        appStore.nextStage();
        navigate(AppRoutes.CHAT_PAGE);
        return;
      }

      try {
        const body = {
          phoneNumber,
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
          this.setPrevPhone(phoneNumber);
          this.setFormattedPhone(formatPhoneNumberIntl(`+${phoneNumber}`));
          appStore.nextStage();
          navigate(AppRoutes.CHAT_PAGE);
        } else {
          toast("Нет такого аккаунта в MAX", {
            toastId: "account_does_not_exist",
          });
          this.setChatId("");
          this.setPrevPhone();
          this.setFormattedPhone("");
        }
      } catch (e) {
        if (e instanceof AxiosError) {
          if (
            e.status === 400 &&
            e.response?.data?.message !==
              "check phone number timeout limit exceeded"
          ) {
            toast.error("Неверный номер телефона", {
              toastId: "invalid_phone_number",
            });
          } else if (e.status === 404) {
            toast.error("Неверный idInstance", { toastId: "404" });
          } else if (e.status === 401) {
            toast.error("Неверный apiTokenInstance", { toastId: "401" });
          } else {
            toast.error("Ошибка. Попробуйте повторить позже.", {
              toastId: "unknown",
            });
          }
        } else {
          toast.error("Ошибка. Попробуйте повторить позже.", {
            toastId: "Unknown",
          });
        }

        this.setChatId("");
        this.setPrevPhone();
        this.setFormattedPhone("");
      } finally {
        this.setIsLoading(false);
      }
    }
  }
}

export default new PhoneStore();
