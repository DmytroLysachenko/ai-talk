import { Server } from "socket.io";
import { createServer } from "http";
import next from "next";
import { KokoroTTS, TextSplitterStream } from "kokoro-js";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// Create HTTP Server
const server = createServer(async (req, res) => {
  await nextHandler(req, res);
});

const io = new Server(server, {
  path: "/api/socket",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ Client connected");

  socket.on("generate_audio", async (message) => {
    try {
      const tts = await KokoroTTS.from_pretrained(
        "onnx-community/Kokoro-82M-v1.0-ONNX",
        {
          dtype: "fp32",
        }
      );

      const splitter = new TextSplitterStream();
      const stream = tts.stream(splitter);

      for await (const { audio } of stream) {
        if (audio) {
          const audioBlob = audio.toBlob();
          const buffer = await audioBlob.arrayBuffer();
          const base64Audio = Buffer.from(buffer).toString("base64");

          socket.emit("audio_chunk", base64Audio);
        }
      }

      socket.emit("audio_end");
    } catch (error) {
      console.error("Error in TTS streaming:", error);
      socket.emit("error", "Failed to generate audio.");
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// Start server
const PORT = process.env.SOCKET_PORT || 3001;
server.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await nextApp.prepare();
});
