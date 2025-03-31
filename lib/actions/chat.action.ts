"use server";

import { aiClient } from "../ai";

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

    const reply = await aiClient.chat.completions.create({
      model: "gpt-4",
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
      answer: "Sorry, I couldn't process that. Could you try again?",
    };
  }
};
