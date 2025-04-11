"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggler";
import { HEADER_LINKS } from "@/constants";

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
            {HEADER_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className={cn(
                  "relative flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === link.href
                    ? "text-foreground after:absolute after:-bottom-[21px] after:left-0 after:h-[2px] after:w-full after:bg-primary"
                    : "text-foreground/60"
                )}
              >
                <span className="mr-1">{link.icon}</span>
                {link.title}
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
              AI links
            </p>
            <div className="grid gap-3">
              {HEADER_LINKS.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-md p-3 text-sm font-medium",
                    pathname === link.href
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">{link.icon}</span>
                  <div>
                    <div className="font-medium">{link.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {link.description}
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
