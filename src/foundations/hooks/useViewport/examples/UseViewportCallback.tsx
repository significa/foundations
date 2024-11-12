import { useState } from 'react';
import { useViewport } from '@/foundations/hooks/useViewport';

export function UseViewportCallback() {
  const [isLarge, setIsLarge] = useState(false);

  useViewport({
    onResize: ({ width }) => {
      setIsLarge(width >= 1440);

      // You can perform any logic here without causing a re-render
      // e.g., updating some external store, triggering an analytics event, etc.
    }
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <p>
        Is viewport width bigger than 1440px? <b>{isLarge ? 'yes' : 'no'}</b>
      </p>
    </div>
  );
}
