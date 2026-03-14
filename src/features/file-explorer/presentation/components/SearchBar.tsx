import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === "Escape" && document.activeElement === inputRef.current) {
        onChange("");
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onChange]);

  return (
    <div className="relative flex items-center">
      <Search size={13} className="absolute left-2.5 text-vault-dim" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search vault..."
        className="w-full h-7 pl-7 pr-16 text-[11px] font-mono bg-vault-surface border border-border/60 rounded-sm
          text-foreground placeholder:text-vault-dim
          focus:outline-none focus:border-vault-glow/30 focus:shadow-[0_0_8px_hsl(var(--vault-glow)/0.08)]
          transition-all"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 text-vault-dim hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      ) : (
        <div className="absolute right-2 text-vault-dim">
          <kbd className="text-[9px] font-mono px-1 py-0.5 border border-border/60 rounded-sm bg-background/50">Ctrl+F</kbd>
        </div>
      )}
    </div>
  );
}
