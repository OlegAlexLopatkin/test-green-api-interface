import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";

import appStore from "src/stores/app-store";
import phoneStore from "src/stores/phone-store";

import { BsArrowLeftShort } from "react-icons/bs";
import Button from "src/components/ui/button";
import IconButton from "src/components/ui/icon-button";
import PhoneNumberInput from "src/components/ui/phone-number-input";

import "react-phone-number-input/style.css";
import "./phone-form.scss";
import { useCallback } from "react";

const PhoneForm = observer(() => {
  const navigate = useNavigate();
  const { isLoading, phone, handleNextButtonClick, setPhone } = phoneStore;

  const handleButtonClick = useCallback(() => {
    handleNextButtonClick(navigate);
  }, [handleNextButtonClick, navigate]);

  return (
    <form className="phone-form">
      <div className="phone-form__wrapper">
        <div className="phone-form__title-wrapper">
          <IconButton
            className="phone-form__icon-button"
            aria-label="На предыдущую страницу"
            disabled={isLoading}
            icon={<BsArrowLeftShort color="rgba(6, 7, 8, 0.84)" size={24} />}
            onClick={appStore.previousStage}
          />

          <h1 className="phone-form__title">GREEN-API MAX</h1>
        </div>

        <p className="phone-form__text">Номер телефона собеседника:</p>

        <PhoneNumberInput value={phone} onChange={setPhone} />

        <Button
          disabled={isLoading}
          label="Дальше"
          onClick={handleButtonClick}
        />
      </div>
    </form>
  );
});

export default PhoneForm;
