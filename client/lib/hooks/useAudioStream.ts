import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

const WS_SERVER = process.env.NEXT_PUBLIC_WS_SERVER || "http://localhost:3001"; // Use env variable

const useAudioStream = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const newSocket = io(WS_SERVER, {
      transports: ["websocket"],
    });

    newSocket.on("audio_chunk", (data) => {
      setAudioQueue((prev) => [...prev, data]);
    });

    newSocket.on("audio_end", () => {
      setIsStreaming(false);
    });

    newSocket.on("connect", () => console.log("✅ WebSocket connected!"));
    newSocket.on("disconnect", () => console.log("❌ WebSocket disconnected!"));

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isPlaying && audioQueue.length > 0) {
      playNextChunk();
    }
  }, [audioQueue, isPlaying]);

  const playNextChunk = async () => {
    if (audioQueue.length === 0 || isPlaying) return;

    setIsPlaying(true);
    const chunk = audioQueue[0];

    if (chunk) {
      const audio = new Audio(`data:audio/wav;base64,${chunk}`);

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setAudioQueue((prev) => prev.slice(1));
      });

      audio.play().catch((err) => console.error("Audio play error:", err));
    }
  };

  const playStreamedAudio = (message: string) => {
    if (isStreaming || !socket) return;
    setIsStreaming(true);
    setAudioQueue([]);
    socket.emit("generate_audio", message);
  };

  return { isPlaying, isStreaming, playStreamedAudio };
};

export default useAudioStream;
