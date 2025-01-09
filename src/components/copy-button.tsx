"use client";

import { Button } from "@/foundations/ui/button/button";
import { cn } from "@/lib/utils";
import { Check, Clipboard } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

export const CopyButton = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
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
    <Button
      variant="ghost"
      size="xs"
      square
      onClick={handleCopy}
      aria-label="Copy"
      className={cn(className)}
    >
      {isCopied ? <Check /> : <Clipboard />}
    </Button>
  );
};
