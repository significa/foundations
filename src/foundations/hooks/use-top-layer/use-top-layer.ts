import { type RefCallback, useCallback, useRef } from 'react';

type PopoverType = 'manual' | 'hint';

const showAsPopover = <T extends HTMLElement>(
  element: T,
  type: PopoverType
) => {
  element.setAttribute('popover', type);
  try {
    element.showPopover();
  } catch {
    // already showing — ignored
  }
};

const hideAsPopover = <T extends HTMLElement>(element: T) => {
  try {
    element.hidePopover();
  } catch {
    // already hidden / not connected — ignored
  }
  element.removeAttribute('popover');
};

/**
 * Custom hook to push an element to the application's Top Layer.
 *
 * `type` controls the popover semantics:
 * - `manual` (default): independent popover that stays open until closed.
 * - `hint`: tooltip-style popover that always stacks above other popovers
 *   without dismissing them. Use this for tooltips so they float above an
 *   already-open `popover="manual"` (e.g. an open dropdown panel).
 *
 * Returns a callback ref. We intentionally don't use `useLayoutEffect`
 * because some floating-ui consumers (notably `<FloatingPortal>`) don't have
 * their target element in the DOM on the first render — the portal node is
 * created in an effect, the element mounts on the *second* render, and a
 * layout effect would have already fired by then with a null ref. A callback
 * ref activates the moment the element attaches, regardless of how many
 * render passes the consumer's wrappers take.
 *
 * If you also need imperative access to the element, compose this ref with
 * your own `useRef` via `composeRefs`.
 *
 *  @example
 * ```tsx
 * const ref = useTopLayer<HTMLDivElement>(isActive);
 * return <div ref={ref}>Top Layer Content</div>;
 * ```
 */
export const useTopLayer = <T extends HTMLElement>(
  active: boolean = true,
  type: PopoverType = 'manual'
): RefCallback<T> => {
  const previousRef = useRef<T | null>(null);

  return useCallback(
    (element: T | null) => {
      const previous = previousRef.current;
      if (previous && previous !== element) hideAsPopover(previous);

      previousRef.current = element;

      if (element && active) showAsPopover(element, type);
    },
    [active, type]
  );
};
