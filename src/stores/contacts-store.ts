import { makeAutoObservable } from "mobx";

class ContactsStore {
  apiTokenInstance = "";
  idInstance = "";

  constructor() {
    makeAutoObservable(this);
  }

  setApiTokenInstance(apiTokenInstance: string) {
    this.apiTokenInstance = apiTokenInstance;
  }

  setIdInstance(idInstance: string) {
    this.idInstance = idInstance;
  }

  saveContacts(idInstance: string, apiTokenInstance: string) {
    this.setIdInstance(idInstance);
    this.setApiTokenInstance(apiTokenInstance);
  }
}

export default new ContactsStore();
