import { cloneElement, useCallback, useEffect, useState, useRef } from 'react';
import debounce from 'debounce';
import { cn, cnva } from 'lib/tailwind';

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  dir?: 'ltr' | 'rtl';
  play?: boolean;
  speedMultiplier?: number;
  autofill?: boolean;
}

const marqueeContentStyles = cnva(
  'animate-[marquee_var(--marquee-duration)_linear_infinite] flex',
  {
    variants: {
      dir: {
        ltr: 'direction-normal',
        rtl: 'direction-reverse'
      },
      play: {
        true: 'running',
        false: 'paused'
      }
    }
  }
);

export function Marquee({
  dir = 'ltr',
  play = true,
  speedMultiplier,
  autofill,
  className,
  children
}: MarqueeProps) {
  const [numClones, setNumClones] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLSpanElement>(null);

  const isReady = useCallback(() => {
    return containerRef.current && childrenRef.current;
  }, [children, containerRef, childrenRef]);

  useEffect(() => {
    if (!isReady()) return;

    function onResize() {
      if (!isReady()) return;

      const { width: containerWidth } = containerRef.current.getBoundingClientRect();
      const { width: childrenWidth } = childrenRef.current.getBoundingClientRect();

      // calculate the number of child clones required to fill the marquee
      // limited to 32 clones
      const requiredClones = Math.min(32, Math.ceil(containerWidth / childrenWidth));

      // calculate marquee loop duration
      const contentSumWidth = childrenWidth * (autofill ? requiredClones : 1);
      setDuration(~~(contentSumWidth / 50)); // 1 second per each 50px

      if (autofill) {
        setNumClones(requiredClones);
      }
    }

    const resizeObserver = new ResizeObserver(debounce(onResize, 256));
    resizeObserver.observe(containerRef.current);

    onResize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [autofill, containerRef, childrenRef]);

  return (
    <div
      ref={containerRef}
      className={cn('w-full overflow-hidden whitespace-nowrap flex', className)}
      style={
        {
          '--marquee-duration': `${duration * (1 / (speedMultiplier ?? 1))}s`
        } as React.CSSProperties
      }
    >
      <span className={marqueeContentStyles({ dir, play })}>
        <span ref={childrenRef}>{children}</span>
        {autofill && (
          <CloneFactory num={numClones - 1}>
            <span>{children}</span>
          </CloneFactory>
        )}
      </span>
      <span className={marqueeContentStyles({ dir, play })}>
        {autofill && (
          <CloneFactory num={numClones}>
            <span>{children}</span>
          </CloneFactory>
        )}
        {!autofill && <span>{children}</span>}
      </span>
    </div>
  );
}

function CloneFactory({ num, children }: { num: number; children: React.ReactElement }) {
  return (
    <>
      {new Array(Math.max(num, 0))
        .fill(null)
        .map((_, index) => cloneElement(children, { key: index }))}
    </>
  );
}
