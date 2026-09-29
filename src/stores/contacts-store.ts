import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";

import appStore from "src/stores/app-store";

import { TextErrors, ToastIds } from "src/constants";

class ContactsStore {
  apiTokenInstance = "";
  idInstance = "";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setApiTokenInstance(apiTokenInstance: string) {
    this.apiTokenInstance = apiTokenInstance;
  }

  setIdInstance(idInstance: string) {
    this.idInstance = idInstance;
  }

  get isFormValid() {
    return !!this.apiTokenInstance.trim() && !!this.idInstance.trim();
  }

  handleNextButtonClick() {
    if (!this.isFormValid) {
      if (!this.apiTokenInstance.trim() && !this.idInstance.trim()) {
        toast.error(
          TextErrors[ToastIds.API_TOKEN_INSTANCE_AND_ID_INSTANCE_ARE_EMPTY],
          {
            toastId: ToastIds.API_TOKEN_INSTANCE_AND_ID_INSTANCE_ARE_EMPTY,
          },
        );
        return;
      }

      if (!this.apiTokenInstance.trim()) {
        toast.error(TextErrors[ToastIds.API_TOKEN_INSTANCE_IS_EMPTY], {
          toastId: ToastIds.API_TOKEN_INSTANCE_IS_EMPTY,
        });
        return;
      }

      if (!this.idInstance.trim()) {
        toast.error(TextErrors[ToastIds.ID_INSTANCE_IS_EMPTY], {
          toastId: ToastIds.ID_INSTANCE_IS_EMPTY,
        });
        return;
      }
    }

    appStore.nextStage();
  }
}

export default new ContactsStore();
