import { useState } from 'react';
import { Marquee } from '@/foundations/components/Marquee';

export function MarqueeSpeedControl() {
  const [speed, setSpeed] = useState<number>(1);

  return (
    <>
      <label className="absolute top-0 left-0 m-4">
        <div className="text-sm text-foreground font-medium mb-1">Speed Multiplier ({speed})</div>
        <input
          type="range"
          className="w-[12rem]"
          defaultValue="1"
          min="0"
          max="10"
          step="0.01"
          onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSpeed(Number(event.target.value))
          }
        />
      </label>
      <Marquee autofill speedMultiplier={speed}>
        <span className="whitespace-pre text-md">🐜 </span>
      </Marquee>
    </>
  );
}
