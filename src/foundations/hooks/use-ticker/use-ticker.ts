import { useCallback, useEffect, useMemo, useRef } from "react";

type Ticker = {
  start: () => void;
  stop: () => void;
  paused: boolean;
};

type TickerCallback = (timestamp: number, delta: number) => void | boolean;

const MIN_DELTA = 0.000000001;

export const useTicker = (callback: TickerCallback): Ticker => {
  const rafId = useRef<number | null>(null);
  const previousTimestamp = useRef(0);
  const callbackRef = useRef(callback);
  const isRunning = useRef(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const tick = useCallback((timestamp: number) => {
    if (!isRunning.current) return;

    const delta = Math.max(MIN_DELTA, timestamp - previousTimestamp.current);
    const shouldContinue = callbackRef.current(timestamp, delta);

    previousTimestamp.current = timestamp;

    if (shouldContinue !== false) {
      rafId.current = window.requestAnimationFrame(tick);
    } else {
      isRunning.current = false;
      rafId.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (rafId.current) {
      window.cancelAnimationFrame(rafId.current);
    }

    isRunning.current = true;
    previousTimestamp.current = performance.now();
    rafId.current = window.requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    if (rafId.current) {
      window.cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    isRunning.current = false;
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return useMemo(
    () => ({
      start,
      stop,
      get paused() {
        return !isRunning.current;
      },
    }),
    [start, stop]
  );
};
