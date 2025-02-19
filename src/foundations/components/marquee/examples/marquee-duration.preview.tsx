"use client";

import { Marquee } from "@/foundations/components/marquee/marquee";
import { useState } from "react";
import { Egg } from "@/components/icons/egg";

const MarqueeDurationExample = () => {
  const [duration, setDuration] = useState(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="speed" className="w-16 text-base font-medium">
          Duration:
        </label>
        <input
          id="speed"
          type="range"
          min={0.01}
          max={2}
          step={0.01}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-48"
        />
        <span className="text-foreground-secondary w-12">
          {duration.toFixed(2)}
        </span>
      </div>
      <Marquee
        duration={duration}
        className="border-border text-foreground-secondary h-[2.5em] w-96 items-center gap-2 rounded border px-2"
      >
        Foundations
        <Egg />
      </Marquee>
    </div>
  );
};

export default MarqueeDurationExample;
