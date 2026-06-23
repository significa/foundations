import { useRef, useState } from "react";

import { useDelayedLoading } from "@/foundations/hooks/use-delayed-loading/use-delayed-loading";
import { Avatar } from "@/foundations/ui/avatar/avatar";
import { Button } from "@/foundations/ui/button/button";
import { Skeleton } from "@/foundations/ui/skeleton/skeleton";
import type { PreviewMeta } from "@/lib/preview";

function LoadingStatesSkeletonPreview() {
  const [isLoading, setIsLoading] = useState(false);
  const timeout = useRef<number | null>(null);

  const showSkeleton = useDelayedLoading(isLoading);

  const reload = (ms: number) => {
    if (timeout.current) window.clearTimeout(timeout.current);
    setIsLoading(true);
    timeout.current = window.setTimeout(() => setIsLoading(false), ms);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-2">
        <Button variant="outline" disabled={isLoading} onClick={() => reload(1500)}>
          Reload (1.5s)
        </Button>
        <Button variant="outline" disabled={isLoading} onClick={() => reload(150)}>
          Quick reload (150ms)
        </Button>
      </div>

      <div className="w-64 rounded-xl border border-border p-4">
        {showSkeleton ? (
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <Avatar.Fallback>Ada Lovelace</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-1 flex-col">
              <span className="font-medium text-sm">Ada Lovelace</span>
              <span className="text-foreground-secondary text-xs">Analytical Engine</span>
            </div>
          </div>
        )}
      </div>

      <p className="max-w-sm text-center text-foreground-secondary text-xs">
        The skeleton mirrors the card's layout, so nothing shifts when content arrives. A quick
        reload finishes before the delay, so the skeleton never flashes.
      </p>
    </div>
  );
}

export const meta = {
  layout: "centered",
} satisfies PreviewMeta;

export default LoadingStatesSkeletonPreview;
