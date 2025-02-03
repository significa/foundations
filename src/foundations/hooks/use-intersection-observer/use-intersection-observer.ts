import { useEffect, useState, RefObject } from "react";
import { useStableCallback } from "@/foundations/hooks/use-stable-callback/use-stable-callback";

type IntersectionCallback = (
  isIntersecting: boolean,
  entry: IntersectionObserverEntry
) => void;

interface UseIntersectionObserverOptions {
  root?: RefObject<HTMLElement | null> | null;
  threshold?: number | number[];
  rootMargin?: string;
}

export const useIntersectionObserver = (
  ref: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  {
    threshold = 0,
    root = null,
    rootMargin = "0%",
  }: UseIntersectionObserverOptions = {},
  callback?: IntersectionCallback
) => {
  const [state, setState] = useState<{
    isIntersecting: boolean;
    entry: IntersectionObserverEntry | undefined;
  }>({
    isIntersecting: false,
    entry: undefined,
  });

  const stableCallback = useStableCallback(callback);

  useEffect(() => {
    const elements = [ref]
      .flat()
      .map((ref) => ref.current)
      .filter((element) => !!element);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;

          if (stableCallback) {
            stableCallback(isIntersecting, entry);
          } else {
            setState({ isIntersecting, entry });
          }
        });
      },
      { threshold, root: root?.current, rootMargin }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [ref, root, rootMargin, stableCallback, threshold]);

  return state;
};
