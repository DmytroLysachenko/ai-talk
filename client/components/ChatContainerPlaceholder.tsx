import { speechToTextPlaceholder } from "@/lib/instructions";
import { Code, FileText, Lightbulb, Mail, Mic } from "lucide-react";
import React from "react";

const ChatContainerPlaceholder = ({ type }: { type: string }) => {
  const icon = () => {
    switch (type) {
      case "text":
        return <FileText className="h-6 w-6 text-primary" />;
      case "code":
        return <Code className="h-6 w-6 text-primary" />;
      case "mail":
        return <Mail className="h-6 w-6 text-primary" />;
      case "prompt":
        return <Lightbulb className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="max-w-lg text-center space-y-4 p-4">
      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        {icon()}
      </div>
      <h3 className="text-lg font-medium">
        <span className="capitalize">{type}</span> Formatting Example
      </h3>
      <p className="text-muted-foreground text-sm">
        Press the microphone button and try saying something like:
      </p>
      <div className="bg-muted p-3 rounded-md text-sm">
        "{speechToTextPlaceholder[type].example}"
      </div>
      <p className="text-xs text-muted-foreground">
        {speechToTextPlaceholder[type].additional}
      </p>
    </div>
  );
};

export default ChatContainerPlaceholder;
