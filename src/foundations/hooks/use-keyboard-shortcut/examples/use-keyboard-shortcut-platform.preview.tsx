import { useEffect, useState } from "react";
import { useKeyboardShortcut } from "@/foundations/hooks/use-keyboard-shortcut/use-keyboard-shortcut";
import { Kbd } from "@/foundations/ui/kbd/kbd";

// Detect Mac on the client only — `navigator` doesn't exist during SSR, so
// the first render assumes non-Mac and updates after hydration.
const useIsMac = () => {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(/Mac|iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);
  return isMac;
};

export default function UseKeyboardShortcutPlatformPreview() {
  const isMac = useIsMac();
  const [count, setCount] = useState(0);

  useKeyboardShortcut({ key: "s", mod: true }, () => setCount((c) => c + 1));

  return (
    <div className="flex flex-col items-center gap-3 text-foreground-secondary text-sm">
      <p>
        Press{" "}
        <Kbd.Group>
          <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
          <Kbd>S</Kbd>
        </Kbd.Group>
      </p>
      <p className="text-2xl text-foreground">Saved {count} times</p>
    </div>
  );
}
