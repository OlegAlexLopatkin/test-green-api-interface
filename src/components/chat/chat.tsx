import { useEffect } from "react";
import { observer } from "mobx-react-lite";

import appStore from "../../stores/app-store";
import chatStore from "../../stores/chat-store";

const Chat = observer(() => {
  useEffect(() => {
    let isMounted = true;
    const getMessages = async () => {
      while (isMounted) {
        await chatStore.getNotification();
      }
    };

    getMessages();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="chat">
      <form onSubmit={(e) => e.preventDefault()}>
        <p>Chat</p>
        <div className="chat__messages-wrapper"></div>
        <div>
          <input
            id="message"
            name="message"
            type="text"
            value={chatStore.message}
            onChange={(e) => chatStore.setMessage(e.target.value)}
          />
        </div>

        <button
          disabled={chatStore.isLoading}
          type="button"
          onClick={() => chatStore.sendMessage()}
        >
          Отправить сообщение
        </button>

        <button
          disabled={chatStore.isLoading}
          type="button"
          onClick={() => appStore.previousStage()}
        >
          Назад
        </button>
      </form>
      {chatStore.messages.map((message) => (
        <p key={message.id}>
          {message.text} {message.senderName} {message.type}
        </p>
      ))}
    </div>
  );
});

export default Chat;
