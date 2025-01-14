import { useEffect, useRef, useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

export const useStableCallback = <T extends AnyFunction>(callback?: T) => {
  const callbackRef = useRef<T | undefined>(callback);

  // Update the ref if the callback changes
  useEffect(() => {
    if (callback) {
      callbackRef.current = callback;
    }
  }, [callback]);

  // Return a stable function that always calls the latest callback if it exists
  const stableCallback = useCallback((...args: Parameters<T>) => {
    if (callbackRef.current) {
      callbackRef.current(...args);
    }
  }, []);

  return stableCallback;
};
