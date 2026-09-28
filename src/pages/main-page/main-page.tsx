import { observer } from "mobx-react-lite";

import appStore from "src/stores/app-store";

import ContactsForm from "src/pages/main-page/components/contacts-form";
import PhoneForm from "src/pages/main-page/components/phone-form";

import "./main-page.scss";

const MainPage = observer(() => {
  return (
    <div className="main-age">
      {appStore.isContactsScreen && <ContactsForm />}
      {appStore.isPhoneScreen && <PhoneForm />}
    </div>
  );
});

export default MainPage;
