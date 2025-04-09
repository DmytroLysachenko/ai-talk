import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mic, MessageSquare, FileText } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Talking AI Pal",
      description:
        "Have voice conversations with AI to practice language skills or just chat.",
      href: "/talking-ai",
      color: "text-primary",
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Speech to Text",
      description:
        "Convert your spoken words into well-structured, formatted text.",
      href: "/speech-convertor",
      color: "text-accent",
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Custom AI Chat",
      description:
        "Create a custom AI assistant with specific instructions for your needs.",
      href: "/custom-chat",
      color: "text-secondary-foreground",
    },
  ];

  return (
    <main className="container py-8 max-w-6xl mx-auto">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Your AI Conversation Toolkit
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Speak, chat, and create with AI tools designed to enhance your
                productivity and learning.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/talking-ai">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="w-full py-12 md:py-24 lg:py-32"
      >
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                AI Tools for Every Need
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore our suite of AI-powered tools designed to help you
                communicate, create, and learn.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col h-full border rounded-lg shadow-sm bg-card overflow-hidden"
              >
                <div className="p-6 space-y-2">
                  <div className={`${feature.color} mb-2`}>{feature.icon}</div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
                <div className="p-6 pt-0 mt-auto">
                  <Link
                    href={feature.href}
                    className="w-full"
                  >
                    <Button className="w-full">Try Now</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
