import { useCallback, useEffect, useRef } from "react";

// Every function's parameters are assignable to `never[]`.
type AnyFunction = (...args: never[]) => unknown;

export const useStableCallback = <T extends AnyFunction>(callback?: T) => {
  const callbackRef = useRef<T | undefined>(callback);

  // Unconditionally: a removed (undefined) callback must stop running.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Return a stable function that always calls the latest callback if it exists
  const stableCallback = useCallback((...args: Parameters<T>) => {
    if (callbackRef.current) {
      callbackRef.current(...args);
    }
  }, []);

  return stableCallback;
};
