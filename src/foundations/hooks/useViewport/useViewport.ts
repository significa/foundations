import { useEffect, useState } from 'react';
import { debounce } from '@/foundations/utils/debounce';

type ViewportSize = {
  width: number;
  height: number;
};

type UseViewportOptions = {
  debounce?: boolean | number;
  onResize?: (size: ViewportSize) => void;
};

export function useViewport(options: UseViewportOptions = {}): ViewportSize {
  const [size, setSize] = useState<ViewportSize>({
    width: typeof window === 'undefined' ? 390 : window.innerWidth,
    height: typeof window === 'undefined' ? 760 : window.innerHeight
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('ResizeObserver' in window)) return;

    let onResize = () => {
      const currentSize = { width: window.innerWidth, height: window.innerHeight };

      if (options.onResize) {
        options.onResize(currentSize);
      } else {
        setSize(currentSize);
      }
    };

    // execute the non-debounce callback immediately to set initial values
    onResize();

    if (debounce) {
      onResize = debounce(onResize, typeof options.debounce === 'boolean' ? 32 : options.debounce);
    }

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.debounce, options.onResize]);

  return size;
}
