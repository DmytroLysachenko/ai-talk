import { useEffect, useRef, useState } from "react";

const useAudio = () => {
  const [lastMessageAudio, setLastMessageAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playLastMessage = () => {
    if (!lastMessageAudio || isPlaying) return;

    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed:", error);
        setIsPlaying(false);
      });
    }
  };

  useEffect(() => {
    if (!lastMessageAudio) return;

    const audio = new Audio();
    audio.src = lastMessageAudio;
    audioRef.current = audio;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);

    audio.play().catch((error) => {
      console.error("Audio playback failed:", error);
      setIsPlaying(false);
    });

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [lastMessageAudio]);

  return { isPlaying, playLastMessage, lastMessageAudio, setLastMessageAudio };
};

export default useAudio;
