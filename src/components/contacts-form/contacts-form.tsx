import { observer } from "mobx-react-lite";

import appStore from "src/stores/app-store";
import contactsStore from "src/stores/contacts-store";

import "./contacts-form.scss";

const ContactsForm = observer(() => {
  return (
    <form className="contacts-form">
      <p>Test</p>
      <div>
        <label>
          Введите Ваш idInstance:
          <input
            id="idInstance"
            name="idInstance"
            required
            type="text"
            value={contactsStore.idInstance}
            onChange={(e) => contactsStore.setIdInstance(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Введите Ваш apiTokenInstance:
          <input
            id="apiTokenInstance"
            name="apiTokenInstance"
            required
            type="text"
            value={contactsStore.apiTokenInstance}
            onChange={(e) => contactsStore.setApiTokenInstance(e.target.value)}
          />
        </label>
      </div>

      <button type="button" onClick={() => appStore.nextStage()}>
        Дальше
      </button>
    </form>
  );
});

export default ContactsForm;
