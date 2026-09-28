import { observer } from "mobx-react-lite";
import classNames from "classnames";

import chatStore from "src/stores/chat-store";

import "./chat-messages.scss";

const ChatMessages = observer(() => {
  return (
    <div className="chat-messages scrollable">
      {chatStore.messages.map(({ id, text, timestamp, type }) => {
        return (
          <div
            className={classNames(
              "chat-messages__message",
              `chat-messages__message_${type}`,
            )}
            key={id}
          >
            <span className="chat-messages__message-text">{text}</span>
            <span
              className={classNames(
                "chat-messages__message-time",
                `chat-messages__message-time_${type}`,
              )}
            >
              {getTime(timestamp)}
            </span>
          </div>
        );
      })}
    </div>
  );
});

function getTime(timestamp: number) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}`;
}

export default ChatMessages;
