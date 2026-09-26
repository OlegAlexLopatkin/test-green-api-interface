import { makeAutoObservable } from "mobx";

import { ScreenStage } from "src/constants";
import type { ScreenStageType } from "src/types";

class AppStore {
  stage: ScreenStageType = ScreenStage.CONTACTS;

  constructor() {
    makeAutoObservable(this);
  }

  setStage(stage: ScreenStageType) {
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
