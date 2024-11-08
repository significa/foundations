import { useRef } from 'react';
import { useElementRect } from '@/foundations/hooks/useElementRect';

export function useElementRectState() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { width, height, x, y } = useElementRect(ref);

  console.log(width);

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center">
      <div>
        <p>
          <b>x:</b> {x}px
        </p>
        <p>
          <b>y:</b> {y}px
        </p>
        <p>
          <b>width:</b> {width}px
        </p>
        <p>
          <b>height:</b> {height}px
        </p>
      </div>
    </div>
  );
}
