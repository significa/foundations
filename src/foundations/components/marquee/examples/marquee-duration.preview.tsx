"use client";

import { Marquee } from "@/foundations/components/marquee/marquee";
import { useState } from "react";
import { Egg } from "@/components/icons/egg";

const MarqueeDurationExample = () => {
  const [duration, setDuration] = useState(1000);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label
          htmlFor="speed"
          className="text-base font-medium whitespace-nowrap"
        >
          Duration <span className="text-foreground-secondary">(ms)</span>
        </label>
        <input
          id="speed"
          type="range"
          min={100}
          max={2000}
          step={100}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-48"
        />
        <span className="text-foreground-secondary w-12">{duration}</span>
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
