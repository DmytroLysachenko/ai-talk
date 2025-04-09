"use client";

import { useState, useEffect } from "react";
import { getMessageAnswer } from "@/lib/actions/chat.action";
import useChat from "@/lib/hooks/useChat";
import useSpeechRecognition from "@/lib/hooks/useSpeechRecognition";
import { speechToCodeInstruction, speechToTextTypes } from "@/lib/instructions";
import MicrophoneButton from "@/components/MicrophoneButton";
import ChatContainer from "@/components/ChatContainer";
import { ArrowLeft, Copy, Code, Check, Mic } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { frameworkOptions, languageOptions, styleOptions } from "@/constants";
import ChatContainerPlaceholder from "@/components/ChatContainerPlaceholder";
import OptionSelector from "@/components/OptionSelector";

const placeholders: Record<string, React.ReactNode> = {
  text: (
    <div className="max-w-lg text-center space-y-4 p-4">
      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Mic className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium">Text Formatting Example</h3>
      <p className="text-muted-foreground text-sm">
        Press the microphone button and try saying something like:
      </p>
      <div className="bg-muted p-3 rounded-md text-sm">
        "I want to write a paragraph about the benefits of artificial
        intelligence in healthcare including improved diagnosis faster treatment
        planning and better patient outcomes"
      </div>
      <p className="text-xs text-muted-foreground">
        The AI will format your speech into well-structured paragraphs with
        proper punctuation and grammar.
      </p>
    </div>
  ),

  code: (
    <div className="max-w-lg text-center space-y-4 p-4">
      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Code className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium">Code Generation Example</h3>
      <p className="text-muted-foreground text-sm">
        Press the microphone button and try saying something like:
      </p>
      <div className="bg-muted p-3 rounded-md text-sm">
        "Create a function that takes an array of numbers and returns the sum of
        all even numbers in the array"
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Use the technology selectors above to customize the language, styling,
        and framework for your code.
      </p>
    </div>
  ),

  mail: (
    <div className="max-w-lg text-center space-y-4 p-4">
      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Mic className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium">Email Draft Example</h3>
      <p className="text-muted-foreground text-sm">
        Press the microphone button and try saying something like:
      </p>
      <div className="bg-muted p-3 rounded-md text-sm">
        "Write an email to my team about the project deadline extension we need
        to move the delivery date from May 15th to May 30th because we're
        waiting for client feedback"
      </div>
      <p className="text-xs text-muted-foreground">
        The AI will create a professional email with proper greeting, body, and
        sign-off.
      </p>
    </div>
  ),

  prompt: (
    <div className="max-w-lg text-center space-y-4 p-4">
      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Mic className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium">AI Prompt Example</h3>
      <p className="text-muted-foreground text-sm">
        Press the microphone button and try saying something like:
      </p>
      <div className="bg-muted p-3 rounded-md text-sm">
        "Create a prompt for DALL-E to generate an image of a futuristic city
        with flying cars tall glass buildings and a sunset in the background
        with a cyberpunk aesthetic"
      </div>
      <p className="text-xs text-muted-foreground">
        The AI will craft an effective prompt optimized for image generation
        systems like DALL-E or Midjourney.
      </p>
    </div>
  ),
};

const SpeechConvertor = () => {
  const { type } = useParams<{ type: string }>();
  const router = useRouter();

  useEffect(() => {
    if (!speechToTextTypes[type] && type !== "code") {
      router.push("/speech-convertor");
    }
  }, [type, router]);

  const { messagesLog, addMessage } = useChat();

  const { currentSpeech, isSpeaking, startSpeaking, stopSpeaking } =
    useSpeechRecognition("en-US");
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

      {showTechSelectors && (
        <div className="mb-6 p-4 border rounded-lg bg-card/50">
          <div className="flex items-center gap-2 mb-3">
            <Code className="h-5 w-5 text-primary" />
            <h2 className="font-medium">Code Generation Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <OptionSelector
              title="Language"
              options={languageOptions}
              value={language}
              onChange={setLanguage}
            />

            <OptionSelector
              title="Styling"
              options={styleOptions}
              value={styleType}
              onChange={setStyleType}
            />

            <OptionSelector
              title="Framework"
              options={frameworkOptions}
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
