import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

const useAudioStream = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const newSocket = io(
      `http://localhost:${process.env.SOCKET_PORT || 3001}`,
      {
        path: "/api/socket",
        transports: ["websocket"],
      }
    );

    newSocket.on("audio_chunk", (data) => {
      setAudioQueue((prev) => [...prev, data]); // Trigger re-render
    });

    newSocket.on("audio_end", () => {
      setIsStreaming(false);
    });

    newSocket.on("connect", () => console.log("✅ WebSocket connected!"));
    newSocket.on("disconnect", () => console.log("❌ WebSocket disconnected!"));

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  const playStreamedAudio = (message: string) => {
    if (isStreaming || !socket) return;
    setIsStreaming(true);
    setAudioQueue([]);

    socket.emit("generate_audio", message);

    const playNextChunk = async () => {
      if (audioQueue.length > 0 && !isPlaying) {
        setIsPlaying(true);
        const chunk = audioQueue.shift();
        if (chunk) {
          const audio = new Audio(`data:audio/mp3;base64,${chunk}`);
          audio.addEventListener("canplaythrough", () => {
            audio.play().then(() => {
              setIsPlaying(false);
              playNextChunk(); // Play next chunk after current finishes
            });
          });
        }
      }
    };

    playNextChunk();
  };

  return { isStreaming, playStreamedAudio };
};

export default useAudioStream;
