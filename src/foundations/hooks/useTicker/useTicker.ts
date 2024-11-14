import { useMemo, useRef, useEffect, useCallback } from 'react';

type Ticker = {
  start: () => void;
  stop: () => void;
};

type TickerCallback = (timestamp: number, previousTimestamp: number) => void | boolean;

export function useTicker(callback: TickerCallback): Ticker {
  const rafId = useRef<number | null>();
  const previousTimestamp = useRef(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // clean-up on unmount
    return () => {
      if (rafId.current) {
        window.cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, []);

  const tick = useCallback((timestamp: number) => {
    const canContinue = callbackRef.current(
      timestamp,
      // make sure previousTimestamp is never greater than the current timestamp
      // which can happen, because performance.now() isn't precisely equal to RAF's timestamp
      Math.min(timestamp, previousTimestamp.current)
    );
    previousTimestamp.current = timestamp;

    if (rafId.current && canContinue !== false) {
      rafId.current = window.requestAnimationFrame(tick);
    }
  }, []);

  const start = useCallback(() => {
    if (rafId.current !== null) {
      window.cancelAnimationFrame(rafId.current);
    }

    previousTimestamp.current = performance.now();
    rafId.current = window.requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    window.cancelAnimationFrame(rafId.current);
    rafId.current = null;
  }, []);

  return useMemo(() => ({ start, stop }), [start, stop]);
}
