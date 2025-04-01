"use server";

import { kokoroAiClient, openAiClient } from "../ai";

export const getAnswer = async (
  chatLog: { author: string; message: string }[]
) => {
  console.log(chatLog);
  try {
    const lastUserMessage =
      chatLog.filter((msg) => msg.author === "user").pop()?.message || "";

    const chatTranscription = chatLog
      .map((message) => `${message.author}: ${message.message}`)
      .join("\n");

    const reply = await openAiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a polite language learning assistant. Your task is to:
          1. Maintain a friendly, encouraging tone
          2. Adapt vocabulary and sentence complexity to the user's apparent level
          3. Gently introduce 1-2 new useful words/phrases per response
          4. Keep responses under 75 words (shorter for beginners)
          5. Progress the conversation naturally
          6. Provide subtle corrections if mistakes are repeated
          7. Suggest related topics when appropriate
          8. Do not be over emotional and positive about the conversation, be more natural and keep 
          
          Current conversation context:
          ${chatTranscription}`,
        },
        {
          role: "user",
          content: lastUserMessage,
        },
      ],
      max_tokens: 100,
    });

    return { success: true, answer: reply.choices[0].message.content };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Answer could not be generated, try again later.",
    };
  }
};

export const generateAudio = async (message: string) => {
  try {
    const response = await kokoroAiClient.audio.speech.create({
      input: message,
      model: "kokoro",
      voice: "af_bella",
      response_format: "mp3",
      speed: 1.0,
    });

    const audioBuffer = await response.arrayBuffer();

    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return { success: true, audio: audioBase64 };
  } catch (error) {
    console.error("Audio generation error:", error);
    return { success: false, error: "Failed to generate audio" };
  }
};
