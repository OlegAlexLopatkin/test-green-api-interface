import { observer } from "mobx-react-lite";

import appStore from "../../stores/app-store";
import phoneStore from "../../stores/phone-store";

const PhoneForm = observer(() => {
  return (
    <form className="phone-form">
      <div>
        <label>
          Введите номер телефона:
          <input
            id="idInstance"
            name="idInstance"
            required
            type="phone"
            value={phoneStore.phone}
            onChange={(e) => phoneStore.setPhone(e.target.value)}
          />
        </label>
      </div>

      <button type="button" onClick={() => appStore.previousStage()}>
        Назад
      </button>
      <button type="button" onClick={() => phoneStore.nextButtonClickHandler()}>
        Дальше
      </button>
    </form>
  );
});

export default PhoneForm;
