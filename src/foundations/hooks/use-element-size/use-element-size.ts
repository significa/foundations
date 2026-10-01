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

  // Older Safari has no box sizes: `contentRect` is the content box, and the layout size
  // (`offset*`, rounded, unaffected by transforms) stands in for the border box
  if (!size) {
    const { target } = entry;
    if (box === "border-box" && target instanceof HTMLElement) {
      return { width: target.offsetWidth, height: target.offsetHeight };
    }
    return { width: entry.contentRect.width, height: entry.contentRect.height };
  }

  // box sizes are logical: in a vertical writing mode the inline axis is the vertical one
  const vertical = !getComputedStyle(entry.target).writingMode.startsWith("horizontal");

  return vertical
    ? { width: size.blockSize, height: size.inlineSize }
    : { width: size.inlineSize, height: size.blockSize };
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
