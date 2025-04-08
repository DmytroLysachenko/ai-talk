"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const NotSupportedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-10">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-destructive">
            Browser Not Supported
          </CardTitle>

          <CardDescription className="text-lg">
            We're unable to access the Speech Recognition API in your browser
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
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
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotSupportedPage;
