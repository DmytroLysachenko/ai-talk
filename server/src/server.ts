import express from "express";
import http from "http";
import { Server } from "socket.io";
import { KokoroTTS, TextSplitterStream } from "kokoro-js";
import morgan from "morgan";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${
        String(timestamp).split(".")[0]
      } [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "logs/server-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
    }),
  ],
});

const app = express();
const server = http.createServer(app);
const port = process.env.SOCKET_PORT || 3001;
if (process.env.NODE_ENV === "production") {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let tts: KokoroTTS | null = null;
(async () => {
  try {
    logger.info("Loading TTS model...");
    tts = await KokoroTTS.from_pretrained(
      "onnx-community/Kokoro-82M-v1.0-ONNX",
      { dtype: "fp32" }
    );
    logger.info("✅ TTS Model Loaded!");
  } catch (error) {
    logger.error("❌ Failed to load TTS Model", error);
  }
})();

io.on("connection", (socket) => {
  logger.info("✅ New client connected", socket.id);

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
      logger.info(`✅ Audio streaming completed for message: "${message}"`);
    } catch (error) {
      logger.error("❌ Error in TTS streaming", error);
      socket.emit("error", "Failed to generate audio.");
    }
  });

  socket.on("disconnect", () => {
    logger.info("❌ Client disconnected", socket.id);
  });
});

server.listen(port, () => {
  logger.info(`🚀 Server running on http://localhost:${port}`);
});
