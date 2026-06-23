import { useRef, useState } from "react";

import { useDelayedLoading } from "@/foundations/hooks/use-delayed-loading/use-delayed-loading";
import { useTicker } from "@/foundations/hooks/use-ticker/use-ticker";
import { Button } from "@/foundations/ui/button/button";
import { Progress } from "@/foundations/ui/progress/progress";
import { Spinner } from "@/foundations/ui/spinner/spinner";
import type { PreviewMeta } from "@/lib/preview";

type Indicator = "none" | "spinner" | "progress";

// The wait-time ladder: pick an indicator from the expected duration.
const indicatorFor = (expectedMs: number): Indicator =>
  expectedMs < 1000 ? "none" : expectedMs < 3000 ? "spinner" : "progress";

const cases = [
  {
    label: "Quick",
    duration: 200,
    caption: "Under 1s → show nothing. An indicator would only flash.",
  },
  {
    label: "Medium",
    duration: 2000,
    caption: "1–3s → an indeterminate spinner.",
  },
  {
    label: "Long",
    duration: 6000,
    caption: "3–10s → a determinate progress bar.",
  },
];

function LoadingStatesLadderPreview() {
  const [isLoading, setIsLoading] = useState(false);
  const [indicator, setIndicator] = useState<Indicator>("none");
  const [value, setValue] = useState(0);

  const showLoading = useDelayedLoading(isLoading);

  const timeout = useRef<number | null>(null);
  const startedAt = useRef(0);
  const duration = useRef(0);

  const ticker = useTicker(() => {
    const pct = Math.min(100, ((performance.now() - startedAt.current) / duration.current) * 100);
    setValue(pct);
    if (pct >= 100) return false;
  });

  const load = (ms: number) => {
    if (timeout.current) window.clearTimeout(timeout.current);

    const next = indicatorFor(ms);
    setIndicator(next);
    setValue(0);
    setIsLoading(true);

    if (next === "progress") {
      startedAt.current = performance.now();
      duration.current = ms;
      ticker.start();
    }

    timeout.current = window.setTimeout(() => {
      setIsLoading(false);
      ticker.stop();
    }, ms);
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
            {c.label} ({c.duration < 1000 ? `${c.duration}ms` : `${c.duration / 1000}s`})
          </Button>
        ))}
      </div>

      <div className="flex h-8 w-64 items-center justify-center text-foreground-secondary text-sm">
        {showLoading && indicator === "spinner" && (
          <span className="flex items-center gap-2">
            <Spinner /> Loading…
          </span>
        )}
        {showLoading && indicator === "progress" && <Progress value={value} className="w-full" />}
        {!(showLoading && indicator !== "none") && (
          <span className="opacity-60">{isLoading ? "Working…" : "Idle"}</span>
        )}
      </div>

      <ul className="max-w-sm space-y-1 text-center text-foreground-secondary text-xs">
        {cases.map((c) => (
          <li key={c.label}>
            <strong className="text-foreground">{c.label}</strong>: {c.caption}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const meta = {
  layout: "centered",
} satisfies PreviewMeta;

export default LoadingStatesLadderPreview;
