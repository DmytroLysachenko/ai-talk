interface ChatContainerProps {
  messages: Array<{ author: string; message: string; timestamp?: Date }>;
  currentSpeech?: string;
  isSpeaking?: boolean;
}

const ChatContainer = ({
  messages,
  currentSpeech,
  isSpeaking,
}: ChatContainerProps) => {
  return (
    <div className="flex-1 p-4 rounded-lg border bg-background overflow-auto max-h-[60vh]">
      <div className="flex flex-col space-y-4 min-h-[300px]">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              No messages yet. Start a conversation!
            </p>
          </div>
        )}

        {messages.map((m, index) => (
          <div
            key={`${m.author}-${index}`}
            className={`flex w-full gap-2 mb-4 ${
              m.author === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.author !== "user" && (
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                AI
              </div>
            )}

            <div
              className={`flex flex-col ${
                m.author === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[80%] break-words rounded-lg p-3 text-sm ${
                  m.author === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.message}
              </div>

              {m.timestamp && (
                <span className="text-xs text-muted-foreground mt-1">
                  {m.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>

            {m.author === "user" && (
              <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium">
                You
              </div>
            )}
          </div>
        ))}

        {isSpeaking && currentSpeech && (
          <div className="flex justify-end mb-4">
            <div className="bg-primary/20 text-primary rounded-lg p-3 max-w-[80%]">
              <p className="text-sm font-medium mb-1">You (speaking):</p>
              <p className="text-sm">{currentSpeech}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
