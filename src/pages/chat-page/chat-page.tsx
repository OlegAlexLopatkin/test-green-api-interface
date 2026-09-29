import { useEffect } from "react";
import { observer } from "mobx-react-lite";

import chatStore from "src/stores/chat-store";

import ChatForm from "src/pages/chat-page/components/chat-form";
import ChatHeader from "src/pages/chat-page/components/chat-header";
import ChatMessages from "src/pages/chat-page/components/chat-messages";
import Loader from "src/components/common/loader";

import "./chat-page.scss";

const ChatPage = observer(() => {
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
    <div className="chat-page">
      <ChatHeader />
      <ChatMessages />
      <ChatForm />
      {chatStore.isLoading && <Loader />}
    </div>
  );
});

export default ChatPage;
