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
