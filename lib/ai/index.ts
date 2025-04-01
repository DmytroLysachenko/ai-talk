import OpenAI from "openai";

export const openAiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const kokoroAiClient = new OpenAI({
  baseURL: "https://api.kokorotts.com/v1",
});
