import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const playAudio = (chunk: string) => {
  const audio = new Audio(`data:audio/wav;base64,${chunk}`);
  return new Promise<void>((resolve, reject) => {
    audio.addEventListener("ended", () => resolve);
    audio.addEventListener("error", () => reject);
    audio.play().catch(reject);
  });
};

export const parseMessageWithCodeBlocks = (message: string) => {
  // Regular expression to match markdown code blocks with optional language
  const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  // Find all code blocks
  while ((match = codeBlockRegex.exec(message)) !== null) {
    // Add text before the code block
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: message.substring(lastIndex, match.index),
      });
    }

    // Add the code block
    parts.push({
      type: "code",
      language: match[1] || "text",
      content: match[2].trim(),
    });

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text after the last code block
  if (lastIndex < message.length) {
    parts.push({
      type: "text",
      content: message.substring(lastIndex),
    });
  }

  // If no code blocks were found, return the original message as text
  if (parts.length === 0) {
    parts.push({
      type: "text",
      content: message,
    });
  }

  return parts;
};
