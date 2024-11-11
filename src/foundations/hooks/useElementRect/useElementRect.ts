import { useEffect, useState, type RefObject } from 'react';
import { debounce } from '@/foundations/utils/debounce';

type ElementRect = {
  width: number;
  height: number;
  x: number;
  y: number;
};

type UseElementRectOptions = {
  debounce?: boolean | number;
  onResize?: (rect: ElementRect) => void;
};

export function useElementRect<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  options: UseElementRectOptions = {}
): ElementRect {
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

      if (options.onResize) {
        options.onResize(currentRect);
      } else {
        setRect(currentRect);
      }
    };

    if (debounce) {
      onResizeObserver = debounce(
        onResizeObserver,
        typeof options.debounce === 'boolean' ? 32 : options.debounce
      );
    }

    const observer = new ResizeObserver(onResizeObserver);
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.debounce, options.onResize, ref]);

  return rect;
}
