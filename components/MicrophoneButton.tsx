import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

const MicrophoneButton = ({
  isSpeaking,
  handleEndSpeaking,
  handleStartSpeaking,
}: {
  isSpeaking: boolean;
  handleEndSpeaking: () => void;
  handleStartSpeaking: () => void;
}) => {
  return (
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
  );
};

export default MicrophoneButton;
