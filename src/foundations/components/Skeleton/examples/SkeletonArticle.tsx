import { useState } from 'react';
import { Button } from '@/foundations/components/Button';
import { Skeleton } from '@/foundations/components/Skeleton';

export function SkeletonArticle() {
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col gap-2 text-foreground">
        {loaded && (
          <>
            <div className="text-xl font-semibold">Eggs, Eggs, Eggs!</div>
            <div className="text-xs text-foreground/70 font-medium max-w-[320px]">
              Eggs: nature’s prepackaged protein pod, versatile enough for everything from breakfast
              to, well, more breakfast. Crack one open, and you’ve got a perfectly balanced combo of
              yolk and white—one part golden goodness, one part suspiciously tasteless goo.
            </div>
            <Button size="sm" variant="secondary" className="w-max mt-4">
              Get Cracking!
            </Button>
          </>
        )}
        {!loaded && (
          <>
            <Skeleton className="font-xl w-[12em] h-[1.6em] rounded-sm" />
            <Skeleton className="font-xl w-[320px] h-[5em] rounded-sm" />
            <Skeleton className="mt-4 w-[90px] h-[32px] rounded-sm" />
          </>
        )}
      </div>
      <div className="absolute top-4 left-4">
        <Button size="sm" onClick={() => setLoaded(!loaded)}>
          {loaded ? 'Unload' : 'Load'}
        </Button>
      </div>
    </>
  );
}
