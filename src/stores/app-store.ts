import { makeAutoObservable } from "mobx";

export const ScreenStage = {
  CONTACTS: "contacts",
  PHONE: "phone",
  CHAT: "chat",
} as const;

export type ScreenStage = (typeof ScreenStage)[keyof typeof ScreenStage];

class AppStore {
  stage: ScreenStage = ScreenStage.CONTACTS;

  constructor() {
    makeAutoObservable(this);
  }

  setStage(stage: ScreenStage) {
    this.stage = stage;
  }

  get isChatScreen() {
    return this.stage === ScreenStage.CHAT;
  }

  get isContactsScreen() {
    return this.stage === ScreenStage.CONTACTS;
  }

  get isPhoneScreen() {
    return this.stage === ScreenStage.PHONE;
  }

  nextStage() {
    if (this.isContactsScreen) {
      this.setStage(ScreenStage.PHONE);
      return;
    }

    if (this.isPhoneScreen) {
      this.setStage(ScreenStage.CHAT);
    }
  }

  previousStage() {
    if (this.isChatScreen) {
      this.setStage(ScreenStage.PHONE);
      return;
    }

    if (this.isPhoneScreen) {
      this.setStage(ScreenStage.CONTACTS);
    }
  }
}

export default new AppStore();
