"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const NotSupportedPage = () => {
  return (
    <main className="container py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-10">
        <div className="max-w-2xl w-full border rounded-lg shadow-sm bg-card overflow-hidden">
          <div className="p-6 text-center space-y-2 border-b">
            <h1 className="text-3xl font-bold text-destructive">
              Browser Not Supported
            </h1>
            <p className="text-lg text-muted-foreground">
              We're unable to access the Speech Recognition API in your browser
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
              <p className="mb-4">
                We're sorry, but Mozilla Firefox doesn't support the Speech
                Recognition API that our application requires.
              </p>
              <p className="font-medium">
                Please use one of the following browsers to access our
                application:
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 rounded-md border bg-card">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Google Chrome</span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-md border bg-card">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Microsoft Edge</span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-md border bg-card">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Safari</span>
              </div>
            </div>
          </div>

          <div className="p-6 border-t flex justify-center">
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotSupportedPage;
