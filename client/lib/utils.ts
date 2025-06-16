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
  const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(message)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: message.substring(lastIndex, match.index),
      });
    }

    parts.push({
      type: "code",
      language: match[1] || "text",
      content: match[2].trim(),
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < message.length) {
    parts.push({
      type: "text",
      content: message.substring(lastIndex),
    });
  }

  if (parts.length === 0) {
    parts.push({
      type: "text",
      content: message,
    });
  }

  return parts;
};
