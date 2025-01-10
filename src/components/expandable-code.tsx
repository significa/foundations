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
            className="absolute z-20 left-1/2 bottom-4 -translate-x-1/2"
          >
            Expand
          </Button>
          <div className="absolute z-10 inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </>
      )}
      <div className="overflow-hidden max-h-[250px] rounded-xl">{children}</div>
    </div>
  );
};
