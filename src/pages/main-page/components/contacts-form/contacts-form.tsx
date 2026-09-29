import { observer } from "mobx-react-lite";

import contactsStore from "src/stores/contacts-store";

import Button from "src/components/ui/button";
import Input from "src/components/ui/input";

import "./contacts-form.scss";

const ContactsForm = observer(() => {
  const {
    apiTokenInstance,
    idInstance,
    handleNextButtonClick,
    setApiTokenInstance,
    setIdInstance,
  } = contactsStore;

  return (
    <form className="contacts-form">
      <div className="contacts-form__wrapper">
        <h1 className="contacts-form__title">GREEN-API MAX</h1>

        <Input
          id="idInstance"
          autoFocus
          name="idInstance"
          placeholder="idInstance"
          required
          type="text"
          value={idInstance}
          onChange={setIdInstance}
        />

        <Input
          id="apiTokenInstance"
          name="apiTokenInstance"
          placeholder="apiTokenInstance"
          required
          type="text"
          value={apiTokenInstance}
          onChange={setApiTokenInstance}
        />

        <Button label="Дальше" onClick={handleNextButtonClick} />
      </div>
    </form>
  );
});

export default ContactsForm;
