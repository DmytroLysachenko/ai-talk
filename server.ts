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

const tts = await KokoroTTS.from_pretrained(
  "onnx-community/Kokoro-82M-v1.0-ONNX",
  { dtype: "fp32" }
);

console.log("✅ Model loaded and ready.");

io.on("connection", async (socket) => {
  console.log("✅ Client connected");

  socket.on("generate_audio", async (message) => {
    console.log("Received message:", message);
    try {
      const splitter = new TextSplitterStream();
      const stream = tts.stream(splitter);

      splitter.push(message); // Send text into the stream
      splitter.close(); // Properly close the input

      for await (const { audio } of stream) {
        if (audio) {
          const buffer = audio.toWav();
          // console.log("Generated WAV buffer size:", buffer.byteLength);

          const base64Audio = Buffer.from(buffer).toString("base64");
          socket.emit("audio_chunk", base64Audio);

          await new Promise((resolve) => setTimeout(resolve, 200)); // Delay for smooth streaming
        }
      }

      socket.emit("audio_end");
    } catch (error) {
      console.error("Error in TTS streaming:", error);
      socket.emit("error", "Failed to generate audio.");
    }
  });

  socket.on("disconnect", () => console.log("❌ Client disconnected"));
});

// Start server
const PORT = process.env.SOCKET_PORT || 3001;
server.listen(PORT, async () => {
  console.log(`🚀 Web-socket Server running on http://localhost:${PORT}`);
  await nextApp.prepare();
});
