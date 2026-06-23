import { useRef, useState } from "react";

import { useDelayedLoading } from "@/foundations/hooks/use-delayed-loading/use-delayed-loading";
import { Button } from "@/foundations/ui/button/button";
import { Spinner } from "@/foundations/ui/spinner/spinner";
import type { PreviewMeta } from "@/lib/preview";

const cases = [
  {
    label: "Load quick",
    duration: 150,
    caption: "Naive flashes a spinner. Delayed shows nothing.",
  },
  {
    label: "Load moderate",
    duration: 500,
    caption: "Naive shows for the whole wait. Delayed appears later and holds.",
  },
  {
    label: "Load slow",
    duration: 2500,
    caption: "Both show a spinner; the delayed one just starts later.",
  },
];

function Indicator({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex w-44 flex-col items-center gap-2 rounded-lg border border-border p-4">
      <span className="text-foreground-secondary text-xs">{label}</span>
      <div className="flex h-6 items-center">
        {active ? (
          <Spinner />
        ) : (
          <span className="text-foreground-secondary text-xs opacity-60">idle</span>
        )}
      </div>
    </div>
  );
}

function UseDelayedLoadingPreview() {
  const [isLoading, setIsLoading] = useState(false);
  const timeout = useRef<number | null>(null);

  const showLoading = useDelayedLoading(isLoading);

  const load = (duration: number) => {
    if (timeout.current) window.clearTimeout(timeout.current);
    setIsLoading(true);
    timeout.current = window.setTimeout(() => setIsLoading(false), duration);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-2">
        {cases.map((c) => (
          <Button
            key={c.label}
            variant="outline"
            disabled={isLoading}
            onClick={() => load(c.duration)}
          >
            {c.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-3">
        <Indicator label="Naive (raw isLoading)" active={isLoading} />
        <Indicator label="useDelayedLoading" active={showLoading} />
      </div>

      <ul className="max-w-sm space-y-1 text-center text-foreground-secondary text-xs">
        {cases.map((c) => (
          <li key={c.label}>
            <strong className="text-foreground">{c.label}</strong> ({c.duration}
            ms): {c.caption}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const meta = {
  layout: "centered",
} satisfies PreviewMeta;

export default UseDelayedLoadingPreview;
