"use client";

import { useState, useRef, type FormEvent } from "react";
import { getChatAnswer } from "@/lib/actions/chat.action";
import useChat from "@/lib/hooks/useChat";
import ChatContainer from "@/components/ChatContainer";
import { Send, Copy } from "lucide-react";
import { toast } from "sonner";

const CustomChat = () => {
  const { messagesLog, addMessage } = useChat();
  const [input, setInput] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    setIsSubmitting(true);
    addMessage({ author: "user", message: input });

    const { success, answer } = await getChatAnswer({
      messagesLog: [...messagesLog, { author: "user", message: input }],
      instructions: instructions || "You are a helpful AI assistant.",
    });

    if (success && answer) {
      addMessage({ author: "ai", message: answer });
    } else {
      addMessage({
        author: "ai",
        message: "Sorry, I couldn't process your request.",
      });
      toast.error("Error", {
        description: "Failed to get a response from the AI.",
      });
    }

    setInput("");
    setIsSubmitting(false);
    inputRef.current?.focus();
  };

  const copyInstructions = () => {
    if (instructions) {
      navigator.clipboard.writeText(instructions);
      toast.success("Copied to clipboard", {
        description: "Instructions copied to clipboard.",
      });
    }
  };

  return (
    <main className="container py-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Custom AI Chat</h1>
        <p className="text-muted-foreground">
          Customize the AI's behavior with specific instructions
        </p>
      </div>

      <div className="space-y-6 border rounded-lg p-6 bg-card/50">
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="instructions"
              className="text-sm font-medium"
            >
              AI Instructions
            </label>
            {instructions && (
              <button
                onClick={copyInstructions}
                className="h-8 px-2 text-xs flex items-center gap-1 rounded hover:bg-accent/20"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
            )}
          </div>
          <textarea
            id="instructions"
            placeholder="Enter instructions for the AI (e.g., 'Act as a language tutor', 'Help me brainstorm ideas', etc.)"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full min-h-[100px] resize-none p-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex flex-col h-[50vh]">
          <ChatContainer messages={messagesLog} />

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 mt-4"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isSubmitting}
              className="flex-1 p-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              disabled={isSubmitting || !input.trim()}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground
                ${
                  isSubmitting || !input.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary/90"
                }
              `}
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CustomChat;
