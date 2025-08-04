import { useState } from "react";
import { Button } from "@/foundations/ui/button/button";
import { cn } from "@/lib/utils";

export const ExpandableCode = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn("relative", className)}>
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
          <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-linear-to-t to-transparent" />
        </>
      )}
      {isExpanded ? (
        children
      ) : (
        <div className="max-h-[250px] overflow-hidden rounded-xl">
          {children}
        </div>
      )}
    </div>
  );
};
