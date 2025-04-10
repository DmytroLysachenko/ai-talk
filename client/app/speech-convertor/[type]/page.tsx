"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Code } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import {
  FRAMEWORK_OPTIONS,
  LANGUAGE_OPTIONS,
  STYLE_OPTIONS,
} from "@/constants";
import ChatContainerPlaceholder from "@/components/ChatContainerPlaceholder";
import OptionSelector from "@/components/OptionSelector";
import { getMessageAnswer } from "@/lib/actions/chat.action";
import useChat from "@/lib/hooks/useChat";
import useSpeechRecognition from "@/lib/hooks/useSpeechRecognition";
import { speechToCodeInstruction, speechToTextTypes } from "@/lib/instructions";
import MicrophoneButton from "@/components/MicrophoneButton";
import ChatContainer from "@/components/ChatContainer";
import LanguageSelector from "@/components/LanguageSelector";

const SpeechConvertor = () => {
  const { type } = useParams<{ type: string }>();
  const router = useRouter();
  const [recognitionLanguage, setRecognitionLanguage] = useState("en-US");
  useEffect(() => {
    if (!speechToTextTypes[type] && type !== "code") {
      router.push("/speech-convertor");
    }
  }, [type, router]);

  const { messagesLog, addMessage } = useChat();

  const { currentSpeech, isSpeaking, startSpeaking, stopSpeaking } =
    useSpeechRecognition(recognitionLanguage);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const [language, setLanguage] = useState("javascript");
  const [styleType, setStyleType] = useState("tailwindcss");
  const [framework, setFramework] = useState("react");

  const handleFetchAnswer = async () => {
    setIsStreaming(true);

    const { success, answer } = await getMessageAnswer({
      message: currentSpeech,
      instructions:
        type !== "code"
          ? speechToTextTypes[type]
          : speechToCodeInstruction(language, styleType, framework),
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

  if (!speechToTextTypes[type] && type !== "code") return null;

  const showTechSelectors = type === "code";

  return (
    <main className="container relative py-8 max-w-6xl mx-auto">
      <div className="px-10">
        <button
          className="bg-accent/40 p-2 rounded-full absolute left-2 top-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Speech to <span className="capitalize">{type}</span> Converter
          </h1>

          <p className="text-muted-foreground">
            Speak your thoughts and AI will convert them into well-structured{" "}
            {type}
          </p>
        </div>
      </div>

      <LanguageSelector
        currentOption={recognitionLanguage}
        onChange={(value: string) => {
          setRecognitionLanguage(value);
        }}
        label="Speech Recognition Language"
        className="flex flex-col items-end mb-5"
      />

      {showTechSelectors && (
        <div className="mb-6 p-4 border rounded-lg bg-card/50">
          <div className="flex items-center gap-2 mb-3">
            <Code className="h-5 w-5 text-primary" />
            <h2 className="font-medium">Code Generation Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <OptionSelector
              title="Language"
              options={LANGUAGE_OPTIONS}
              value={language}
              onChange={setLanguage}
            />

            <OptionSelector
              title="Styling"
              options={STYLE_OPTIONS}
              value={styleType}
              onChange={setStyleType}
            />

            <OptionSelector
              title="Framework"
              options={FRAMEWORK_OPTIONS}
              value={framework}
              onChange={setFramework}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col h-[60vh] border rounded-lg p-6 bg-card/50">
        <ChatContainer
          messages={messagesLog}
          currentSpeech={currentSpeech}
          isSpeaking={isSpeaking}
          placeholder={<ChatContainerPlaceholder type={type} />}
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
