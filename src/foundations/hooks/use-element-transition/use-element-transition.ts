"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { nextFrame } from "@/foundations/utils/dom/next-frame";

type Status = "unmounted" | "initial" | "open" | "closed";

interface UseElementTransitionReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  isMounted: boolean;
  status: Status;
}

/**
 * React hook to manage the mounting, unmounting, and transition states of a DOM element,
 * typically for animating the appearance and disappearance of UI components with CSS transitions.
 *
 * This hook ensures that the element remains mounted (`isMounted` is `true`) until all CSS transitions or animations have completed.
 *
 * Inspired by the `useTransitionStatus` hook from Floating UI:
 * @see https://floating-ui.com/docs/useTransition#usetransitionstatus
 *
 * @example
 * ```tsx
 * const { ref, isMounted, status } = useElementTransition<HTMLDivElement>(open);
 *
 * if (!isMounted) return null;
 *
 * return (
 *  <div ref={ref} data-status={status} className="data-[status=closed]:opacity-0 transition-all">
 *      Content
 *  </div>
 * );
 * ```
 */
export const useElementTransition = <T extends HTMLElement>(
  shouldMount: boolean
): UseElementTransitionReturn<T> => {
  const ref = useRef<T>(null);
  const [isMounted, setIsMounted] = useState(shouldMount);
  const [status, setStatus] = useState<Status>(
    shouldMount ? "open" : "unmounted"
  );

  if (shouldMount && !isMounted) {
    setIsMounted(true);
  }

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (shouldMount || !isMounted) return;

    const triggerUnmount = () => {
      setIsMounted(false);
      setStatus("unmounted");
    };

    nextFrame(() => {
      const hasTransitions = element.getAnimations().length > 0;

      if (hasTransitions) {
        const onTransitionEnd = () => {
          const isFinished = element.getAnimations().length === 0;

          if (isFinished) {
            triggerUnmount();
          }
        };

        element.addEventListener("transitionend", onTransitionEnd);
        element.addEventListener("transitioncancel", onTransitionEnd);

        return () => {
          element.removeEventListener("transitionend", onTransitionEnd);
          element.removeEventListener("transitioncancel", onTransitionEnd);
        };
      } else {
        triggerUnmount();
      }
    });
  }, [shouldMount, isMounted]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    if (shouldMount) {
      setStatus("initial");

      return nextFrame(() => {
        flushSync(() => setStatus("open"));
      }, 2); // firefox needs a second frame for the initial transition to work
    }

    setStatus("closed");
  }, [shouldMount]);

  return { ref, isMounted, status };
};
