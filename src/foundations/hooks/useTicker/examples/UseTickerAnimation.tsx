import { useTicker } from '@/foundations/hooks/useTicker';
import { Button } from '@/foundations/components/Button';
import { useRef } from 'react';

export function UseTickerAnimation() {
  const ref = useRef<HTMLDivElement>();
  const angle = useRef(0);

  const ticker = useTicker((timestamp, delta) => {
    angle.current = (angle.current + delta / 10) % 360;

    updateAnimation();
  });

  function updateAnimation() {
    if (ref.current) {
      ref.current.style.transform = `rotate(${angle.current}deg)`;
    }
  }

  function reset() {
    angle.current = 0;
    updateAnimation();
  }

  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="absolute left-4 top-4 flex flex-col gap-3">
        <Button onClick={ticker.start}>Start</Button>
        <Button variant="secondary" onClick={ticker.stop}>
          Stop
        </Button>
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
      </div>
      <div ref={ref} className="size-48 bg-accent rounded-2xl" />
    </div>
  );
}
