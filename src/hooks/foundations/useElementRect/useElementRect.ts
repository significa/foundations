import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

import { debounce as debounceFn } from 'lib/utils/debounce';

type ElementRect = {
  width: number;
  height: number;
  x: number;
  y: number;
};

type UseElementRectOptions<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T>;
  debounce?: boolean | number;
  onResize?: (rect: ElementRect) => void;
};

export const useElementRect = ({
  ref,
  debounce = 32,
  onResize
}: UseElementRectOptions): ElementRect => {
  const [rect, setRect] = useState<ElementRect>({ width: 0, height: 0, x: 0, y: 0 });

  useEffect(() => {
    if (!ref.current) return;
    if (typeof window === 'undefined' || !('ResizeObserver' in window)) return;

    let onResizeObserver = (entries: ResizeObserverEntry[]) => {
      if (!entries.length) return;

      const entry = entries[0];

      // Safeguard for older browsers that might not support borderBoxSize
      const width = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
      const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
      const { x, y } = entry.contentRect;

      const currentRect = { width, height, x, y };

      if (onResize) {
        onResize(currentRect);
      } else {
        setRect(currentRect);
      }
    };

    if (debounce) {
      onResizeObserver = debounceFn(
        onResizeObserver,
        typeof debounce === 'boolean' ? 32 : debounce
      );
    }

    const observer = new ResizeObserver(onResizeObserver);
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [debounce, onResize, ref]);

  return rect;
};
