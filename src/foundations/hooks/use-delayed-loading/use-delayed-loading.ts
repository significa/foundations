import { useEffect, useRef, useState } from 'react';

interface UseDelayedLoadingOptions {
  delay?: number;
  minDuration?: number;
}

export const useDelayedLoading = (
  isLoading: boolean,
  { delay = 300, minDuration = 1000 }: UseDelayedLoadingOptions = {}
): boolean => {
  const [showLoading, setShowLoading] = useState(false);
  const shownAt = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      const delayId = window.setTimeout(() => {
        shownAt.current = performance.now();
        setShowLoading(true);
      }, delay);

      return () => window.clearTimeout(delayId);
    }

    if (shownAt.current === null) return;

    const elapsed = performance.now() - shownAt.current;
    const remaining = minDuration - elapsed;

    const hide = () => {
      shownAt.current = null;
      setShowLoading(false);
    };

    if (remaining <= 0) {
      hide();
      return;
    }

    const minId = window.setTimeout(hide, remaining);

    return () => window.clearTimeout(minId);
  }, [isLoading, delay, minDuration]);

  return showLoading;
};
