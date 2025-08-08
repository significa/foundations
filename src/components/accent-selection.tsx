import { Button } from "@/foundations/ui/button/button";
import {
  Dropdown,
  DropdownItem,
  DropdownItems,
  DropdownTrigger,
} from "@/foundations/ui/dropdown/dropdown";

const themes: { label: string; background: string; foreground?: string }[] = [
  {
    label: "Contrast",
    background: "var(--color-foreground)",
    foreground: "var(--color-background)",
  },
  { label: "Red", background: "oklch(0.64 0.21 25)" },
  { label: "Orange", background: "oklch(0.7 0.19 48)" },
  {
    label: "Yellow",
    background: "oklch(83.84% 0.172 83.57)",
    foreground: "oklch(0 0 0)",
  },
  { label: "Green", background: "oklch(0.70 0.15 162)" },
  { label: "Blue", background: "oklch(0.62 0.19 260)" },
  { label: "Purple", background: "oklch(0.61 0.22 293)" },
  { label: "Pink", background: "oklch(0.66 0.21 354)" },
];

export const AccentSelection = () => {
  const setAccent = (background: string, foreground?: string) => {
    document.documentElement.style.setProperty("--color-accent", background);
    document.documentElement.style.setProperty(
      "--color-accent-foreground",
      foreground ?? "oklch(100% 0 0)"
    );
  };

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          square
          aria-label="Accent color selection"
        >
          <div className="bg-accent size-3 rounded-full" />
        </Button>
      </DropdownTrigger>
      <DropdownItems className="w-54">
        {themes.map((theme) => (
          <DropdownItem
            key={theme.label}
            onSelect={() => setAccent(theme.background, theme.foreground)}
          >
            <div
              className="size-3 rounded-full bg-(--bg)"
              style={{
                "--bg": theme.background,
              }}
            />
            <span>{theme.label}</span>
          </DropdownItem>
        ))}
      </DropdownItems>
    </Dropdown>
  );
};
