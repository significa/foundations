import { useRef, useEffect, useState } from 'react';

type State = {
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

type UseIntersectionObserverOptions = {
  root?: Element | Document | null;
  threshold?: number | number[];
  rootMargin?: string;
  onIntersection?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void;
};

type IntersectionReturn = {
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    onIntersection
  }: UseIntersectionObserverOptions = {}
): IntersectionReturn {
  const [state, setState] = useState<State>({ isIntersecting: false, entry: undefined });
  const onIntersectionRef = useRef<UseIntersectionObserverOptions['onIntersection']>();
  onIntersectionRef.current = onIntersection;

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;

          if (onIntersection && onIntersectionRef.current) {
            onIntersectionRef.current(isIntersecting, entry);
          } else {
            setState({ isIntersecting, entry });
          }
        });
      },
      { threshold, root, rootMargin }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [onIntersection, ref, root, rootMargin, threshold]);

  return state;
}
