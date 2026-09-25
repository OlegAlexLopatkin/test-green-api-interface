import { observer } from "mobx-react-lite";

import appStore from "./stores/app-store";
import Chat from "./components/chat";
import ContactsForm from "./components/contacts-form";
import PhoneForm from "./components/phone-form";
import "./App.scss";

const App = observer(() => {
  return (
    <div>
      {appStore.isContactsScreen && <ContactsForm />}
      {appStore.isPhoneScreen && <PhoneForm />}
      {appStore.isChatScreen && <Chat />}
    </div>
  );
});

export default App;
