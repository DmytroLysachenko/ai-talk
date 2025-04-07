"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggler";
import { Menu, X } from "lucide-react";

const tools = [
  {
    title: "Talking AI Pal",
    href: "/talking-ai",
    description:
      "A talking AI assistant. Perfect for having conversations for English learning.",
    icon: "🗣️",
  },
  {
    title: "Speech to Text",
    href: "/speech-convertor/text",
    description:
      "Express everything you have on your mind and AI will convert it into original, structured, and easy-to-read text.",
    icon: "📝",
  },
  // {
  //   title: "Speech to Prompt",
  //   href: "/speech-convertor/prompt",
  //   description:
  //     "Express everything you have on your mind and AI will convert it into original, structured, and easy-to-read AI prompt.",
  //   icon: "📝",
  // },
  // {
  //   title: "Speech to Mail",
  //   href: "/speech-convertor/mail",
  //   description:
  //     "Express everything you have on your mind and AI will convert it into original, structured, and easy-to-read email.",
  //   icon: "📝",
  // },
  {
    title: "Custom AI Chat",
    href: "/custom-chat",
    description:
      "Determine the purpose of the conversation and AI will adapt to that purpose.",
    icon: "💬",
  },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-10">
        <Link
          href="/"
          className="flex items-center space-x-2"
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Talk
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <nav className="flex items-center space-x-6">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className={cn(
                  "relative flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === tool.href
                    ? "text-foreground after:absolute after:-bottom-[21px] after:left-0 after:h-[2px] after:w-full after:bg-primary"
                    : "text-foreground/60"
                )}
              >
                <span className="mr-1">{tool.icon}</span>
                {tool.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        <ModeToggle />
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t px-4">
          <div className="container py-4 space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              AI Tools
            </p>
            <div className="grid gap-3">
              {tools.map((tool) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-md p-3 text-sm font-medium",
                    pathname === tool.href
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">{tool.icon}</span>
                  <div>
                    <div className="font-medium">{tool.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {tool.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
