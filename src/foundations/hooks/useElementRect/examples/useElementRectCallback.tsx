import { useRef } from 'react';
import { useElementRect } from '@/foundations/hooks/useElementRect';

export function useElementRectCallback() {
  const ref = useRef<HTMLDivElement | null>(null);

  useElementRect(ref, {
    onResize: (rect) => {
      console.log('Element dimensions:', rect);

      // You can perform any logic here without causing a re-render
      // e.g., updating some external store, triggering an analytics event, etc.
    }
  });

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center">
      <p>Resize this box to see the dimensions logged in the console.</p>
    </div>
  );
}
