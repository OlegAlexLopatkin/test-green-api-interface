import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";

import appStore from "src/stores/app-store";
import phoneStore from "src/stores/phone-store";

import { BsArrowLeftShort } from "react-icons/bs";
import IconButton from "src/components/ui/icon-button";

import { AppRoutes } from "src/constants";

import "./chat-header.scss";

const ChatHeader = observer(() => {
  const navigate = useNavigate();
  const handleButtonClick = useCallback(() => {
    appStore.previousStage();
    navigate(AppRoutes.MAIN_PAGE);
  }, [navigate]);

  return (
    <header className="chat-header">
      <div className="chat-header__info">
        <IconButton
          aria-label="На предыдущую страницу"
          icon={<BsArrowLeftShort color="rgba(6, 7, 8, 0.84)" size={24} />}
          onClick={handleButtonClick}
        />

        <span className="chat-header__phone">{phoneStore.formattedPhone}</span>
      </div>
    </header>
  );
});

export default ChatHeader;
