import Link from "next/link";
import { FileText, Code, Mail, Lightbulb } from "lucide-react";

const conversionTypes = [
  {
    id: "text",
    name: "General Text",
    description:
      "Convert your speech into well-structured paragraphs and general text content.",
    icon: <FileText className="h-10 w-10" />,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: "code",
    name: "Code Snippets",
    description:
      "Generate code snippets and programming solutions from your verbal descriptions.",
    icon: <Code className="h-10 w-10" />,
    color:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    id: "mail",
    name: "Email Drafts",
    description:
      "Create professional email drafts from your spoken instructions.",
    icon: <Mail className="h-10 w-10" />,
    color:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    id: "prompt",
    name: "AI Prompts",
    description:
      "Craft effective AI prompts for various AI tools and platforms.",
    icon: <Lightbulb className="h-10 w-10" />,
    color:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
];

const SpeechConvertorHome = () => {
  return (
    <main className="container py-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Speech to Text Converter</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose the type of content you want to generate from your speech. Each
          option is optimized for different use cases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {conversionTypes.map((type) => (
          <Link
            key={type.id}
            href={`/speech-convertor/${type.id}`}
            className="block group"
          >
            <div className="h-full border rounded-lg p-6 transition-all hover:shadow-md hover:border-primary/50 bg-card/50">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${type.color}`}>
                  {type.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {type.name}
                  </h2>
                  <p className="text-muted-foreground">{type.description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default SpeechConvertorHome;
