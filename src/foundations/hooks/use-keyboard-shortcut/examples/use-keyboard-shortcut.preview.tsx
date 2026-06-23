import { useState } from "react";
import { useKeyboardShortcut } from "@/foundations/hooks/use-keyboard-shortcut/use-keyboard-shortcut";
import { Kbd } from "@/foundations/ui/kbd/kbd";

export default function UseKeyboardShortcutPreview() {
  const [count, setCount] = useState(0);

  useKeyboardShortcut({ key: "i", mod: true }, () => setCount((c) => c + 1));

  return (
    <div className="flex flex-col items-center gap-3 text-foreground-secondary text-sm">
      <p>
        Press{" "}
        <Kbd.Group>
          <Kbd>⌘</Kbd>
          <Kbd>I</Kbd>
        </Kbd.Group>{" "}
        (or{" "}
        <Kbd.Group>
          <Kbd>Ctrl</Kbd>
          <Kbd>I</Kbd>
        </Kbd.Group>
        )
      </p>
      <p className="text-2xl text-foreground">Pressed {count} times</p>
    </div>
  );
}
