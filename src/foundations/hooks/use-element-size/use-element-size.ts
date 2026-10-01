import { useEffect, useRef, useState } from "react";

// a `type`, not an `interface`: it has to be assignable to `style` (`CSSProperties` has an index
// signature for custom properties, which interfaces don't satisfy)
type ElementSize = {
  width: number;
  height: number;
};

type ElementSizeCallback = (size: ElementSize, entry: ResizeObserverEntry) => void;

interface UseElementSizeOptions {
  box?: ResizeObserverBoxOptions;
}

const readSize = (entry: ResizeObserverEntry, box: ResizeObserverBoxOptions): ElementSize => {
  const sizes = {
    "border-box": entry.borderBoxSize,
    "content-box": entry.contentBoxSize,
    "device-pixel-content-box": entry.devicePixelContentBoxSize,
  }[box];
  const size = sizes?.[0];

  // Older Safari only has `contentRect` (the content box)
  if (!size) return { width: entry.contentRect.width, height: entry.contentRect.height };

  return { width: size.inlineSize, height: size.blockSize };
};

export const useElementSize = <T extends HTMLElement>(
  { box = "border-box" }: UseElementSizeOptions = {},
  callback?: ElementSizeCallback,
) => {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<ElementSize | undefined>(undefined);

  const callbackRef = useRef<ElementSizeCallback | undefined>(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const next = readSize(entry, box);

      if (callbackRef.current) {
        callbackRef.current(next, entry);
      } else {
        // same size, same object: no re-render
        setSize((prev) =>
          prev?.width === next.width && prev.height === next.height ? prev : next,
        );
      }
    });

    observer.observe(element, { box });

    return () => observer.disconnect();
  }, [box]);

  return [ref, size] as const;
};

export type { ElementSize };
