"use client";

import MicrophoneButton from "@/components/MicrophoneButton";
import { Button } from "@/components/ui/button";
import { generateAudio, getAnswer } from "@/lib/actions/chat.action";
import useAudio from "@/lib/hooks/useAudio";
import useChat from "@/lib/hooks/useChat";
import useSpeechRecognition from "@/lib/hooks/useSpeechRecognition";

export default function Home() {
  const { messagesLog, addMessage } = useChat();
  const { currentSpeech, isSpeaking, startSpeaking, stopSpeaking } =
    useSpeechRecognition();
  const { isPlaying, playLastMessage, lastMessageAudio, setLastMessageAudio } =
    useAudio();

  const handleFetchAnswer = async (
    messagesLog: { author: string; message: string }[]
  ) => {
    const { success, answer } = await getAnswer(messagesLog);

    if (!success || !answer) {
      console.error("failed to fetch answer");
      return "This answer failed to fetch, continue conversation";
    }

    return answer;
  };

  const handleFetchAudio = async (message: string) => {
    const { success, audio } = await generateAudio(message);

    if (!success || !audio) {
      console.error("failed to fetch audio response");
      return "";
    }

    const audioDataUrl = `data:audio/mp3;base64,${audio}`;

    return audioDataUrl;
  };

  const handleEndSpeaking = async () => {
    const userMessage = await stopSpeaking();

    addMessage({ author: "user", message: userMessage });

    const message = await handleFetchAnswer([
      ...messagesLog,
      { author: "user", message: userMessage },
    ]);

    if (message) {
      addMessage({ author: "ai", message });

      const audioDataUrl = await handleFetchAudio(message);

      if (audioDataUrl) {
        setLastMessageAudio(audioDataUrl);
      }

      playLastMessage();
    }
  };

  return (
    <main className="min-h-screen">
      <div className="flex flex-col justify-between items-center min-h-[600px] py-10 px-5 gap-5">
        <div className="flex flex-1 w-[600px] flex-col gap-5 justify-end py-5 border p-4 rounded-2xl">
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

        <MicrophoneButton
          isSpeaking={isSpeaking}
          handleStartSpeaking={startSpeaking}
          handleEndSpeaking={handleEndSpeaking}
        />

        <Button
          variant="ghost"
          disabled={isPlaying || !lastMessageAudio}
          onClick={playLastMessage}
        >
          Replay last message
        </Button>
      </div>
    </main>
  );
}
