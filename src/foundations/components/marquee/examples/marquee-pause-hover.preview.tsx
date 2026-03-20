'use client';

import { useState } from 'react';

import { Egg } from '@/components/icons/egg';
import { Marquee } from '@/foundations/components/marquee/marquee';

const MarqueePauseHoverExample = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="space-y-4">
      <div className="font-medium text-base">Hover to pause</div>
      <Marquee
        paused={isPaused}
        className="h-[2.5em] w-96 items-center gap-2 rounded border border-border px-2 text-foreground-secondary"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        Foundations
        <Egg />
      </Marquee>
    </div>
  );
};

export default MarqueePauseHoverExample;
