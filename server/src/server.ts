import express from "express";
import http from "http";
import { Server } from "socket.io";
import { KokoroTTS, TextSplitterStream } from "kokoro-js";

const app = express();
const server = http.createServer(app);
const port = process.env.SOCKET_PORT || 3001;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let tts: KokoroTTS | null = null;
(async () => {
  try {
    tts = await KokoroTTS.from_pretrained(
      "onnx-community/Kokoro-82M-v1.0-ONNX",
      { dtype: "fp32" }
    );
  } catch (error) {
    console.log(error);
  }
})();

io.on("connection", (socket) => {
  console.log("✅ New client connected", socket.id);

  socket.on("generate_audio", async (message: string) => {
    if (!tts) {
      socket.emit("error", "TTS Model not loaded.");
      return;
    }

    try {
      const splitter = new TextSplitterStream();
      const stream = tts.stream(splitter);
      splitter.push(message);
      splitter.close();

      for await (const { audio } of stream) {
        if (audio) {
          const buffer = audio.toWav();
          const base64Audio = Buffer.from(buffer).toString("base64");

          socket.emit("audio_chunk", base64Audio);
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      socket.emit("audio_end");
      console.log(`✅ Audio streaming completed for message: "${message}"`);
    } catch (error) {
      console.log("❌ Error in TTS streaming", error);
      socket.emit("error", "Failed to generate audio.");
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
