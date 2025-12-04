import { cn } from "@/lib/utils";

interface CurrencyToggleProps {
  value: "AED" | "USD";
  onChange: (currency: "AED" | "USD") => void;
}

export function CurrencyToggle({ value, onChange }: CurrencyToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-border bg-muted/50 p-0.5 text-xs">
      <button
        type="button"
        onClick={() => onChange("AED")}
        className={cn(
          "px-3 py-1.5 rounded-full transition-colors font-medium",
          value === "AED"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
        data-testid="toggle-currency-aed"
      >
        AED
      </button>
      <button
        type="button"
        onClick={() => onChange("USD")}
        className={cn(
          "px-3 py-1.5 rounded-full transition-colors font-medium",
          value === "USD"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
        data-testid="toggle-currency-usd"
      >
        USD
      </button>
    </div>
  );
}
