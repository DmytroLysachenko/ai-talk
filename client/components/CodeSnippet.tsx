"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { toast } from "sonner";

interface CodeSnippetProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  className?: string;
}

const CodeSnippet = ({
  code,
  language = "text",
  showLineNumbers = true,
  maxHeight = "max-h-[600px]",
  className = "",
}: CodeSnippetProps) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyToClipboard = () => {
    if (!code) return;

    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard");

    // Reset copied state after 2 seconds
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Count the number of lines for line numbers
  const lineCount = code.split("\n").length;

  return (
    <div
      className={`rounded-lg overflow-hidden border bg-card/80 ${className}`}
    >
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Terminal className="h-4 w-4" />
          <span>{language.toUpperCase()}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-background/80 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content with optional line numbers */}
      <div className={`overflow-auto ${maxHeight}`}>
        <div className="flex min-w-full">
          {/* Line numbers */}
          {showLineNumbers && (
            <div className="text-right pr-4 py-4 select-none bg-muted/30 text-muted-foreground">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div
                  key={i}
                  className="text-xs font-mono leading-5 px-2"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          )}

          {/* Code content */}
          <pre
            ref={codeRef}
            className="flex-1 p-4 overflow-auto font-mono text-sm leading-5 text-foreground"
          >
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippet;
