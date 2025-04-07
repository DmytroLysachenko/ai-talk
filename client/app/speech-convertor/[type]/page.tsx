"use client";

import { useState } from "react";
import { getMessageAnswer } from "@/lib/actions/chat.action";
import useChat from "@/lib/hooks/useChat";
import useSpeechRecognition from "@/lib/hooks/useSpeechRecognition";
import { speechToTextTypes } from "@/lib/instructions";
import MicrophoneButton from "@/components/MicrophoneButton";
import ChatContainer from "@/components/ChatContainer";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

const SpeechConvertor = () => {
  const { type } = useParams<{ type: string }>();
  const router = useRouter();
  if (!speechToTextTypes[type]) {
    router.push("/speech-convertor/text-to-speech");
  }
  const { messagesLog, addMessage } = useChat();
  const { currentSpeech, isSpeaking, startSpeaking, stopSpeaking } =
    useSpeechRecognition("en-US");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleFetchAnswer = async () => {
    setIsStreaming(true);
    const { success, answer } = await getMessageAnswer({
      message: currentSpeech,
      instructions: speechToTextTypes[type],
    });
    setIsStreaming(false);

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

    const message = await handleFetchAnswer();

    if (message) {
      addMessage({ author: "ai", message });
    }

    setIsProcessing(false);
  };

  const copyLastAIMessage = () => {
    const lastAIMessage = [...messagesLog]
      .reverse()
      .find((m) => m.author === "ai");
    if (lastAIMessage) {
      navigator.clipboard.writeText(lastAIMessage.message);
      toast.success("Copied to clipboard", {
        description: "The AI response has been copied to your clipboard.",
      });
    }
  };

  return (
    <main className="container py-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Speech to Text Converter</h1>
        <p className="text-muted-foreground">
          Speak your thoughts and AI will convert them into well-structured text
        </p>
      </div>

      <div className="flex flex-col h-[60vh] border rounded-lg p-6 bg-card/50">
        <ChatContainer
          messages={messagesLog}
          currentSpeech={currentSpeech}
          isSpeaking={isSpeaking}
        />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <MicrophoneButton
            isSpeaking={isSpeaking}
            isProcessing={isProcessing}
            isStreaming={isStreaming}
            handleStartSpeaking={startSpeaking}
            handleEndSpeaking={handleEndSpeaking}
          />

          {messagesLog.some((m) => m.author === "ai") && (
            <button
              onClick={copyLastAIMessage}
              className="flex items-center gap-2 px-4 py-2 rounded-md border bg-background hover:bg-accent/20 transition-colors"
            >
              <Copy className="h-4 w-4" />
              Copy Last Response
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default SpeechConvertor;
