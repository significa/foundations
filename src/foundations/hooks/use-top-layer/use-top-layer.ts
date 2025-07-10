import { useLayoutEffect, useRef } from "react";

/**
 * Custom hook to push an element to the application's Top Layer.
 *
 * @template T - The type of the HTML element to attach the ref to.
 * @param {boolean} [active=true] - Whether the element should be pushed to the Top Layer.
 * @returns {React.RefObject<T>} A ref to be attached to the target HTML element.
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
