import { useEffect, useRef, MutableRefObject } from 'react';

export function useParentRef<T extends HTMLElement>(
  childRef: MutableRefObject<T | null>
): MutableRefObject<HTMLElement | null> {
  const parentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (childRef.current) {
      parentRef.current = childRef.current.parentNode as HTMLElement;
    }
  }, [childRef]);

  return parentRef;
}
