"use client";

import MicrophoneButton from "@/components/MicrophoneButton";
import { getMessageAnswer } from "@/lib/actions/chat.action";
import useChat from "@/lib/hooks/useChat";
import useSpeechRecognition from "@/lib/hooks/useSpeechRecognition";
import { speechToText } from "@/lib/instructions";

const SpeechConvertor = () => {
  const { messagesLog, addMessage } = useChat();
  const { currentSpeech, isSpeaking, startSpeaking, stopSpeaking } =
    useSpeechRecognition("en-US");

  const handleFetchAnswer = async () => {
    const { success, answer } = await getMessageAnswer({
      message: currentSpeech,
      instructions: speechToText,
    });

    if (!success || !answer) {
      console.error("failed to fetch answer");
      return "This answer failed to fetch, continue conversation";
    }

    return answer;
  };

  const handleEndSpeaking = async () => {
    const userMessage = await stopSpeaking();

    addMessage({ author: "user", message: userMessage });

    const message = await handleFetchAnswer();

    if (message) {
      addMessage({ author: "ai", message });
    }
  };

  return (
    <main className="min-h-[80vh] flex w-full px-5 md:px-10 lg:px-20">
      <div className="flex flex-col justify-between items-center py-10 px-5 gap-5 w-full">
        <div className="flex flex-1 flex-col gap-5 justify-end py-5 border p-4 rounded-2xl w-full">
          {messagesLog.map((m, index) => (
            <p
              key={`${m.author}-${index}`}
              className={m.author === "user" ? "text-blue-500" : ""}
            >
              {m.author} : {m.message}
            </p>
          ))}
          {isSpeaking && currentSpeech && (
            <p className="text-blue-500 opacity-70">
              you (speaking): {currentSpeech}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 items-center">
          <MicrophoneButton
            isSpeaking={isSpeaking}
            handleStartSpeaking={startSpeaking}
            handleEndSpeaking={handleEndSpeaking}
          />
        </div>
      </div>
    </main>
  );
};

export default SpeechConvertor;
