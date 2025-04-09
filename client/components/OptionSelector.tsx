import { Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface OptionSelectorProps {
  title: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const OptionSelector = ({
  title,
  options,
  value,
  onChange,
  className = "",
}: OptionSelectorProps) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">{title}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors ${
              value === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {value === option.value && <Check className="h-3.5 w-3.5" />}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionSelector;
