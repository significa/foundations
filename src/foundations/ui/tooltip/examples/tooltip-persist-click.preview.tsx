"use client";

import { ClipboardIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { Button } from "@/foundations/ui/button/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/foundations/ui/tooltip/tooltip";

export default function TooltipPersistClickPreview() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <Tooltip
      persistOnClick
      delayIn={0}
      onOpenChange={(open) => {
        if (!open) setCopied(false);
      }}
    >
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          square
          size="sm"
          onClick={() => setCopied(true)}
          aria-label="Copy"
        >
          <ClipboardIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : "Copy"}</TooltipContent>
    </Tooltip>
  );
}
