"use client";

import { Button } from "@/components/ui/button";
import { getAnswer } from "@/lib/actions/chat.action";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messagesLog, setMessagesLog] = useState<
    { author: string; message: string }[]
  >([]);
  const [currentSpeech, setCurrentSpeech] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleFetchAnswer = async (
    messagesLog: { author: string; message: string }[]
  ) => {
    const { success, answer } = await getAnswer(messagesLog);
    if (!success || !answer) {
      console.log("failed to fetch answer");
      return;
    }
    setMessagesLog((prev) => [...prev, { author: "ai", message: answer }]);
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported");
      return;
    }

    if (isSpeaking) {
      // Initialize recognition if not already done
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          const transcript =
            event.results[event.results.length - 1][0].transcript;
          setCurrentSpeech((prev) => prev + " " + transcript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsSpeaking(false);
        };
      }

      // Start recognition
      recognitionRef.current.start();
    } else {
      // Stop recognition and save accumulated speech
      if (recognitionRef.current) {
        recognitionRef.current.stop();

        if (currentSpeech.trim()) {
          setMessagesLog((prev) => [
            ...prev,
            { author: "you", message: currentSpeech.trim() },
          ]);
          setCurrentSpeech("");

          handleFetchAnswer([
            ...messagesLog,
            { author: "you", message: currentSpeech.trim() },
          ]);
        }
      }
    }

    return () => {
      // Cleanup on unmount
      recognitionRef.current?.stop();
    };
  }, [isSpeaking]);

  const handleStartSpeaking = () => {
    setIsSpeaking((prev) => !prev);
  };

  const handleEndSpeaking = () => {
    setTimeout(() => {
      setIsSpeaking((prev) => !prev);
    }, 1000);
  };

  return (
    <main className="min-h-screen">
      <div className="flex flex-col justify-between items-center min-h-[600px] py-10 px-5 gap-5">
        <div className="flex flex-1 w-[600px] flex-col gap-5 justify-end py-5 border p-4 rounded-2xl">
          {messagesLog.map((m, index) => (
            <p
              key={`${m.author}-${index}`}
              className={m.author === "you" ? "text-blue-500" : ""}
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

        <Button
          variant="ghost"
          className={cn(
            "rounded-full",
            isSpeaking
              ? "bg-green-300 hover:bg-green-400"
              : "bg-gray-300 hover:bg-gray-400"
          )}
          onClick={isSpeaking ? handleEndSpeaking : handleStartSpeaking}
        >
          <Image
            src="/microphone.svg"
            width={32}
            height={32}
            alt="microphone"
            className={cn("size-5", isSpeaking && "animate-bounce")}
          />
        </Button>
      </div>
    </main>
  );
}
