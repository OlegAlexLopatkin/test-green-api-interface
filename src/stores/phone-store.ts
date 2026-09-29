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
import { API_URL, AppRoutes, TextErrors, ToastIds } from "src/constants";
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

  async handleNextButtonClick(navigate: NavigateFunction) {
    if (!this.phone || !this.isValidPhone) {
      if (!this.phone) {
        toast.error(TextErrors[ToastIds.PHONE_IS_EMPTY], {
          toastId: ToastIds.PHONE_IS_EMPTY,
        });
        return;
      }

      toast.error(TextErrors[ToastIds.INVALID_PHONE_NUMBER], {
        toastId: ToastIds.INVALID_PHONE_NUMBER,
      });
      return;
    }

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
        toast(TextErrors[ToastIds.ACCOUNT_DOES_NOT_EXIST], {
          toastId: ToastIds.ACCOUNT_DOES_NOT_EXIST,
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
          toast.error(TextErrors[ToastIds.INVALID_PHONE_NUMBER], {
            toastId: ToastIds.INVALID_PHONE_NUMBER,
          });
        } else if (e.status === 404) {
          toast.error(TextErrors[ToastIds.INVALID_INSTANCE], {
            toastId: ToastIds.INVALID_INSTANCE,
          });
        } else if (e.status === 401) {
          toast.error(TextErrors[ToastIds.INVALID_API_TOKEN], {
            toastId: ToastIds.INVALID_API_TOKEN,
          });
        } else {
          toast.error(TextErrors[ToastIds.SOMETHING_WENT_WRONG], {
            toastId: ToastIds.SOMETHING_WENT_WRONG,
          });
        }
      } else {
        toast.error(TextErrors[ToastIds.SOMETHING_WENT_WRONG], {
          toastId: ToastIds.SOMETHING_WENT_WRONG,
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

export default new PhoneStore();
