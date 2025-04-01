import { useState } from "react";

const useChat = () => {
  const [messagesLog, setMessagesLog] = useState<
    { author: string; message: string }[]
  >([]);

  const addMessage = ({
    author,
    message,
  }: {
    author: string;
    message: string;
  }) => {
    setMessagesLog((prev) => [...prev, { author, message }]);
  };

  const lastMessage = messagesLog[messagesLog.length - 1];

  return { messagesLog, addMessage, lastMessage };
};

export default useChat;
