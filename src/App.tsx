import { observer } from "mobx-react-lite";

import appStore from "src/stores/app-store";
import Chat from "src/components/chat";
import ContactsForm from "src/components/contacts-form";
import PhoneForm from "src/components/phone-form";

import "./App.scss";

const App = observer(() => {
  return (
    <div className="app">
      {appStore.isContactsScreen && <ContactsForm />}
      {appStore.isPhoneScreen && <PhoneForm />}
      {appStore.isChatScreen && <Chat />}
    </div>
  );
});

export default App;
