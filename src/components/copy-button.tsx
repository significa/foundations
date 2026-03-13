import { CheckIcon, ClipboardIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/foundations/ui/button/button";
import { cn } from "@/lib/utils/classnames";

type CopyButtonProps = {
  className?: string;
} & ({ content: string; target?: never } | { target: string; content?: never });

const CopyButton = ({ className, ...props }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = () => {
    const text =
      "target" in props && props.target
        ? ((document.querySelector(props.target) as HTMLElement)?.innerText ?? "")
        : (props.content ?? "");

    navigator.clipboard.writeText(text);
    setIsCopied(true);

    timeout.current = setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return (
    <Button variant="ghost" size="xs" square onClick={handleCopy} aria-label="Copy" className={cn(className)}>
      {isCopied ? <CheckIcon /> : <ClipboardIcon />}
    </Button>
  );
};

export { CopyButton };
