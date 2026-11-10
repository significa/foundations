import type { Ref, RefCallback } from "react";

// Returns the detach step: the callback ref's own cleanup (React 19), or the pre-19 null.
const setRef = <T>(ref: Ref<T> | undefined, instance: T | null): (() => void) => {
  if (typeof ref === "function") {
    const cleanup = ref(instance);
    return typeof cleanup === "function" ? cleanup : () => ref(null);
  }

  if (ref) {
    ref.current = instance;
    return () => {
      ref.current = null;
    };
  }

  return () => {};
};

/**
 * Composes refs into one callback ref. It returns a new callback on each call, so memoise it
 * (`useMemo`) where the element re-renders: a new ref makes React detach and re-attach every ref.
 */
export function composeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (instance) => {
    const cleanups = refs.map((ref) => setRef(ref, instance));

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  };
}
