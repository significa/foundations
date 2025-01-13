"use client";

import { useState } from "react";
import { Button } from "@/foundations/ui/button/button";

export const ExpandableCode = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isExpanded) return children;

  return (
    <div className="relative">
      {!isExpanded && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2"
          >
            Expand
          </Button>
          <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t to-transparent" />
        </>
      )}
      <div className="max-h-[250px] overflow-hidden rounded-xl">{children}</div>
    </div>
  );
};
