import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

export const openAiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const googleGenAiClient = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY!,
});
