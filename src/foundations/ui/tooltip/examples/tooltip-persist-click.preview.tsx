"use client";

import { useEffect, useState } from "react";
import { Tooltip } from "../tooltip";
import { Button } from "../../button/button";
import { ClipboardIcon } from "@phosphor-icons/react";

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
      content={copied ? "Copied!" : "Copy"}
      onOpenChange={(open) => {
        if (!open) setCopied(false);
      }}
    >
      <Button
        variant="outline"
        square
        size="sm"
        onClick={() => setCopied(true)}
        aria-label="Copy"
      >
        <ClipboardIcon />
      </Button>
    </Tooltip>
  );
}
