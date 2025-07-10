import { useLayoutEffect, useRef } from "react";

/**
 * Custom hook to push an element to the application's Top Layer.
 *
 *  @example
 * ```tsx
 * const ref = useTopLayer<HTMLDivElement>(isActive);
 * return <div ref={ref}>Top Layer Content</div>;
 * ```
 */
export const useTopLayer = <T extends HTMLElement>(
  active: boolean = true
): React.RefObject<T | null> => {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (active) {
      element.setAttribute("popover", "manual");
      element.showPopover();
    }

    return () => {
      element.removeAttribute("popover");
    };
  }, [active]);

  return ref;
};
