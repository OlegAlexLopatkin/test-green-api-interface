import { observer } from "mobx-react-lite";

import contactsStore from "../../stores/contacts-store";
import appStore from "../../stores/app-store";

const ContactsForm = observer(() => {
  return (
    <form className="contacts-form">
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
