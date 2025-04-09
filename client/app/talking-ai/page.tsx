"use client";

import { useState } from "react";
import { getChatAnswer } from "@/lib/actions/chat.action";
import useAudioStream from "@/lib/hooks/useAudioStream";
import useChat from "@/lib/hooks/useChat";
import useSpeechRecognition from "@/lib/hooks/useSpeechRecognition";
import { languageLearning } from "@/lib/instructions";
import MicrophoneButton from "@/components/MicrophoneButton";
import ChatContainer from "@/components/ChatContainer";

const TalkingAi = () => {
  const { messagesLog, addMessage } = useChat();
  const { currentSpeech, isSpeaking, startSpeaking, stopSpeaking } =
    useSpeechRecognition("en-US");
  const { isStreaming, isPlaying, playStreamedAudio } = useAudioStream();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFetchAnswer = async (
    messagesLog: { author: string; message: string }[]
  ) => {
    const { success, answer } = await getChatAnswer({
      messagesLog,
      instructions: languageLearning,
    });

    if (!success || !answer) {
      console.error("failed to fetch answer");
      return "This answer failed to fetch, continue conversation";
    }

    return answer;
  };

  const handleEndSpeaking = async () => {
    setIsProcessing(true);
    const userMessage = await stopSpeaking();

    addMessage({ author: "user", message: userMessage });

    const message = await handleFetchAnswer([
      ...messagesLog,
      { author: "user", message: userMessage },
    ]);

    if (message) {
      addMessage({ author: "ai", message });

      await playStreamedAudio(message);
    }

    setIsProcessing(false);
  };

  return (
    <main className="container py-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Talking AI Assistant</h1>
        <p className="text-muted-foreground">
          Have a conversation with AI to practice your language skills. The AI
          will respond with voice.
        </p>
      </div>

      <div className="flex flex-col h-[60vh] border rounded-lg p-6 bg-card/50">
        <ChatContainer
          messages={messagesLog}
          currentSpeech={currentSpeech}
          isSpeaking={isSpeaking}
        />

        <div className="flex justify-center mt-6">
          <MicrophoneButton
            isSpeaking={isSpeaking}
            isProcessing={isProcessing}
            isStreaming={isStreaming}
            isPlaying={isPlaying}
            handleStartSpeaking={startSpeaking}
            handleEndSpeaking={handleEndSpeaking}
          />
        </div>
      </div>
    </main>
  );
};

export default TalkingAi;
