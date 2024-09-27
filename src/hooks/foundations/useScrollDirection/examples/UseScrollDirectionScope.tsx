import { useRef } from 'react';
import { useScrollDirection } from 'hooks/foundations/useScrollDirection';

export function UseScrollDirectionScope() {
  const box = useRef();

  const rootScrollDirection = useScrollDirection();
  const boxScrollDirection = useScrollDirection(box);

  function logScrollDirection(dir) {
    switch (dir) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '—';
    }
  }

  return (
    <div className="absolute inset-0 grid grid-cols-2">
      <div className="p-4 text-md">
        <div className="text-lg font-semibold">Scroll Direction</div>
        <div className="">Root: {logScrollDirection(rootScrollDirection)}</div>
        <div className="">Box: {logScrollDirection(boxScrollDirection)}</div>
      </div>
      <div
        ref={box}
        className="overflow-scroll m-2 p-2 rounded-md border border-dashed border-primary/50 bg-primary/5"
      >
        <div className="sticky top-1/2 text-center translate-y-[-50%]">
          <div className="text-md">Scrollable Box</div>
          <div className="text-sm opacity-50">(scroll here)</div>
        </div>
        <div className="h-[200vh]" />
      </div>
    </div>
  );
}
