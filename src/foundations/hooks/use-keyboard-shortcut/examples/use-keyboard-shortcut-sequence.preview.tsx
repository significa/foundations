import { useState } from "react";
import { useKeyboardShortcut } from "@/foundations/hooks/use-keyboard-shortcut/use-keyboard-shortcut";
import { Kbd } from "@/foundations/ui/kbd/kbd";

export default function UseKeyboardShortcutSequencePreview() {
  const [where, setWhere] = useState<string | null>(null);

  useKeyboardShortcut({ sequence: ["g", "h"] }, () => setWhere("Home"));
  useKeyboardShortcut({ sequence: ["g", "i"] }, () => setWhere("Inbox"));
  useKeyboardShortcut({ sequence: ["g", "s"] }, () => setWhere("Settings"));

  return (
    <div className="flex flex-col items-center gap-3 text-foreground-secondary text-sm">
      <p>
        Press <Kbd>g</Kbd> then <Kbd>h</Kbd>, <Kbd>i</Kbd>, or <Kbd>s</Kbd>
      </p>
      <p className="text-2xl text-foreground">{where ? `Went to ${where}` : "Nowhere yet"}</p>
    </div>
  );
}
