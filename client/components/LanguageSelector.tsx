"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPEECH_LANGUAGES } from "@/constants";

interface LanguageSelectorProps {
  currentOption: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

const LanguageSelector = ({
  currentOption,
  onChange,
  label = "Recognition Language",
  className = "",
}: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted) return null;

  const selectedLanguage =
    SPEECH_LANGUAGES.find((lang) => lang.value === currentOption) ||
    SPEECH_LANGUAGES[0];

  return (
    <div
      className={cn("relative", className)}
      ref={dropdownRef}
    >
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-fit px-3 py-2 text-sm border rounded-md",
          "bg-background hover:bg-accent/10 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary/50"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="mr-1">{selectedLanguage.flag}</span>
          <span>{selectedLanguage.label}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg max-h-60 overflow-auto">
          <ul
            className="py-1"
            role="listbox"
          >
            {SPEECH_LANGUAGES.map((language) => (
              <li
                key={language.value}
                role="option"
                aria-selected={currentOption === language.value}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-sm cursor-pointer",
                  "hover:bg-accent/50 transition-colors",
                  currentOption === language.value ? "bg-accent/30" : ""
                )}
                onClick={() => {
                  console.log(language.value);
                  onChange(language.value);
                  setIsOpen(false);
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="mr-1">{language.flag}</span>
                  <span>{language.label}</span>
                </span>
                {currentOption === language.value && (
                  <Check className="h-4 w-4" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
