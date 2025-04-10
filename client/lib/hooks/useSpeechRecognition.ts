import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const useSpeechRecognition = (language: string) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition not supported");
      redirect("/not-supported");
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true; // Changed to true to get real-time results
    recognitionRef.current.lang = language;

    const handleResult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setCurrentSpeech(transcript);
    };

    const handleError = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      setIsSpeaking(false);
    };

    const handleEnd = () => {
      setIsSpeaking(false);
    };

    recognitionRef.current.addEventListener("result", handleResult);
    recognitionRef.current.addEventListener("error", handleError);
    recognitionRef.current.addEventListener("end", handleEnd);

    return () => {
      recognitionRef.current?.removeEventListener("result", handleResult);
      recognitionRef.current?.removeEventListener("error", handleError);
      recognitionRef.current?.removeEventListener("end", handleEnd);
      recognitionRef.current?.stop();
    };
  }, [language]);

  const startSpeaking = () => {
    setCurrentSpeech("");
    setIsSpeaking(true);
    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.error("Failed to start recognition:", error);
    }
  };

  const stopSpeaking = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    recognitionRef?.current?.stop();

    setCurrentSpeech("");

    return currentSpeech;
  };

  return { isSpeaking, currentSpeech, startSpeaking, stopSpeaking };
};

export default useSpeechRecognition;
