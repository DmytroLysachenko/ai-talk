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
let unloadTimeout: NodeJS.Timeout | null = null;

async function getTTS(): Promise<KokoroTTS> {
  if (tts) return tts;

  console.log("⏳ Loading Kokoro TTS model...");
  tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
    dtype: "q4f16",
  });
  console.log("✅ TTS model loaded.");
  return tts;
}

function scheduleModelUnload(delay = 60000) {
  if (unloadTimeout) clearTimeout(unloadTimeout);
  unloadTimeout = setTimeout(() => {
    console.log("🧹 Unloading TTS model from memory.");
    tts = null;
    global.gc?.();
  }, delay);
}

io.on("connection", (socket) => {
  console.log("✅ New client connected", socket.id);

  socket.on("generate_audio", async (message: string) => {
    try {
      const tts = await getTTS();

      const splitter = new TextSplitterStream();
      const stream = tts.stream(splitter);

      const tokens = message.match(/\s*\S+/g) || [];

      (async () => {
        let chunkCount = 0;
        for await (const { audio } of stream) {
          if (!audio) continue;

          const buffer = audio.toWav();
          const base64Audio = Buffer.from(buffer).toString("base64");

          socket.emit("audio_chunk", base64Audio);

          chunkCount++;
          if (chunkCount % 3 === 0) global.gc?.();

          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        socket.emit("audio_end");
        console.log(`✅ Audio streaming completed for message: "${message}"`);

        scheduleModelUnload();
      })();

      for (const token of tokens) {
        splitter.push(token);
        await new Promise((r) => setTimeout(r, 10));
      }

      splitter.close();
    } catch (error) {
      console.log("❌ Error in TTS streaming", error);
      socket.emit("error", "TTS failed.");
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected", socket.id);
  });
});

app.get("/", (_req, res) => {
  res.send("Server is alive!");
});

server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
