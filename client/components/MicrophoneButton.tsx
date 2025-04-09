"use client";

import { cn } from "@/lib/utils";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface MicrophoneButtonProps {
  isSpeaking: boolean;
  isProcessing?: boolean;
  isStreaming?: boolean;
  isPlaying?: boolean;
  handleStartSpeaking: () => void;
  handleEndSpeaking: () => void;
}

const MicrophoneButton = ({
  isSpeaking,
  isProcessing = false,
  isStreaming = false,
  isPlaying = false,
  handleStartSpeaking,
  handleEndSpeaking,
}: MicrophoneButtonProps) => {
  const isDisabled = isProcessing || isStreaming || isPlaying;

  return (
    <button
      onClick={isSpeaking ? handleEndSpeaking : handleStartSpeaking}
      disabled={isDisabled}
      className={cn(
        "rounded-full h-16 w-16 flex items-center justify-center transition-all cursor-pointer",
        isSpeaking
          ? "bg-destructive hover:bg-destructive/90"
          : "bg-primary hover:bg-primary/90",
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      )}
    >
      {isProcessing ? (
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      ) : isSpeaking ? (
        <MicOff className="h-6 w-6 text-white" />
      ) : (
        <Mic className="h-6 w-6 text-white" />
      )}
      <span className="sr-only">
        {isSpeaking ? "Stop recording" : "Start recording"}
      </span>
    </button>
  );
};

export default MicrophoneButton;
