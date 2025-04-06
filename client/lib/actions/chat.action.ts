"use server";

import { openAiClient, googleGenAiClient } from "../ai";

export const getChatAnswer = async ({
  messagesLog,
  instructions,
}: {
  messagesLog: { author: string; message: string }[];
  instructions: string;
}) => {
  try {
    const lastUserMessage =
      messagesLog.filter((msg) => msg.author === "user").pop()?.message || "";

    const chatTranscription = messagesLog
      .map((message) => `${message.author}: ${message.message}`)
      .join("\n");

    const message = `
        ${instructions}

        Current conversation context:
        ${chatTranscription}
        
        User: ${lastUserMessage}`;

    const response = await googleGenAiClient.chats
      .create({ model: "gemini-2.0-flash" })
      .sendMessage({
        message,
      });

    return { success: true, answer: response.text };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Answer could not be generated, try again later.",
    };
  }
};

export const getMessageAnswer = async ({
  message: userMessage,
  instructions,
}: {
  message: string;
  instructions: string;
}) => {
  try {
    const message = `
        ${instructions}
        
        User: ${userMessage}`;

    const response = await googleGenAiClient.chats
      .create({ model: "gemini-2.0-flash" })
      .sendMessage({
        message,
      });

    return { success: true, answer: response.text };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Answer could not be generated, try again later.",
    };
  }
};

export const generateAudio = async ({
  message,
  isFree,
}: {
  message: string;
  isFree: boolean;
}) => {
  try {
    const response = await openAiClient.audio.speech.create({
      input: message,
      instructions:
        "Please keep the tone of the voice natural and friendly, don't be over emotional",
      model: "gpt-4o-mini-tts",
      voice: "alloy",
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
