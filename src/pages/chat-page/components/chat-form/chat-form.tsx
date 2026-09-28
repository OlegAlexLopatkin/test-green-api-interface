import { useCallback, type ChangeEvent } from "react";
import { observer } from "mobx-react-lite";

import chatStore from "src/stores/chat-store";

import { BsArrowUpShort } from "react-icons/bs";
import IconButton from "src/components/ui/icon-button";

import { MAX_MESSAGE_LENGTH } from "src/constants";

import "./chat-form.scss";

const ChatForm = observer(() => {
  const { isLoading, isMessageValid, message, sendMessage, setMessage } =
    chatStore;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) =>
      setMessage(e.target.value),
    [setMessage],
  );

  return (
    <form className="chat-form">
      <div className="chat-form__input-wrapper">
        <textarea
          className="chat-form__textarea"
          id="message"
          autoFocus
          disabled={isLoading}
          maxLength={MAX_MESSAGE_LENGTH}
          name="message"
          value={message}
          onChange={handleChange}
        >
          Сообщение
        </textarea>

        <IconButton
          className="chat-form__send-message-button"
          aria-label="Отправить сообщение"
          disabled={isLoading || !isMessageValid}
          icon={<BsArrowUpShort color="#ffffff" size={24} />}
          theme="primary"
          type="submit"
          onClick={sendMessage}
        />
      </div>
    </form>
  );
});

export default ChatForm;
