"use server";

import { openAiClient, googleGenAiClient } from "../ai";

export const getAnswer = async (
  messagesLog: { author: string; message: string }[]
) => {
  try {
    const lastUserMessage =
      messagesLog.filter((msg) => msg.author === "user").pop()?.message || "";

    const chatTranscription = messagesLog
      .map((message) => `${message.author}: ${message.message}`)
      .join("\n");

    const message = `You are a polite language learning assistant. Your task is to:
        1. Maintain a friendly, encouraging tone
        2. Adapt vocabulary and sentence complexity to the user's apparent level
        3. Gently introduce 1-2 new useful words/phrases per response
        4. Keep responses under 75 words (shorter for beginners)
        5. Progress the conversation naturally
        6. Provide subtle corrections if mistakes are repeated
        7. Suggest related topics when appropriate
        8. Keep it natural, avoid excessive enthusiasm.
        9. Do not use symbols not recognized by TTS models (such as emoji,*, /,\,|,~, etc.)
        
        Current conversation context:
        ${chatTranscription}
        
        User: ${lastUserMessage}`;

    // Use Gemini AI (Google's API)
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
    let response;

    if (isFree) {
      response = await openAiClient.audio.speech.create({
        input: message,
        instructions:
          "Please keep the tone of the voice natural and friendly, don't be over emotional",
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        response_format: "mp3",
        speed: 1.0,
      });
    } else {
      response = await openAiClient.audio.speech.create({
        input: message,
        instructions:
          "Please keep the tone of the voice natural and friendly, don't be over emotional",
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        response_format: "mp3",
        speed: 1.0,
      });
    }

    const audioBuffer = await response.arrayBuffer();

    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return { success: true, audio: audioBase64 };
  } catch (error) {
    console.error("Audio generation error:", error);
    return { success: false, error: "Failed to generate audio" };
  }
};
