import { makeAutoObservable } from "mobx";

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

  saveContacts(idInstance: string, apiTokenInstance: string) {
    this.setIdInstance(idInstance);
    this.setApiTokenInstance(apiTokenInstance);
  }
}

export default new ContactsStore();
