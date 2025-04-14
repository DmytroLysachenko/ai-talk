import express from "express";
import http from "http";
import { Server } from "socket.io";
import { KokoroTTS, TextSplitterStream } from "kokoro-js";

const app = express();
const server = http.createServer(app);
const port = parseInt(process.env.PORT || "3001", 10);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let tts: KokoroTTS | null = null;

async function getTTS(): Promise<KokoroTTS> {
  if (tts) return tts;

  console.log("⏳ Loading Kokoro TTS model...");
  tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
    dtype: "q8",
  });
  console.log("✅ TTS model loaded.");
  return tts;
}

io.on("connection", (socket) => {
  console.log("✅ New client connected", socket.id);

  socket.on("generate_audio", async (message: string) => {
    try {
      const tts = await getTTS();

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
      socket.emit("error", "TTS failed.");
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Server is alive!");
});

server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
