import { RefObject, useEffect, useRef } from "react";

export type ScrollLockTarget =
  | string
  | HTMLElement
  | RefObject<HTMLElement>
  | undefined;

const getTargetElement = (target: ScrollLockTarget): HTMLElement | null => {
  if (!target) return document.body;
  if (target instanceof HTMLElement) return target;
  if (typeof target === "string") return document.querySelector(target);
  if (target && "current" in target) return target.current || null;

  return null;
};

export const useScrollLock = (isLocked: boolean, target?: ScrollLockTarget) => {
  const targetElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    targetElementRef.current = getTargetElement(target);
  }, [target]);

  useEffect(() => {
    const targetElement = targetElementRef.current;
    if (!targetElement) return;

    const previousStyles = {
      overflow: targetElement.style.overflow,
      scrollbarGutter: targetElement.style.scrollbarGutter,
    };

    if (isLocked) {
      targetElement.style.overflow = "hidden";
      targetElement.style.scrollbarGutter = "stable";
    }

    return () => {
      if (previousStyles.overflow) {
        targetElement.style.overflow = previousStyles.overflow;
      } else {
        targetElement.style.removeProperty("overflow");
      }

      if (previousStyles.scrollbarGutter) {
        targetElement.style.scrollbarGutter = previousStyles.scrollbarGutter;
      } else {
        targetElement.style.removeProperty("scrollbar-gutter");
      }
    };
  }, [isLocked]);
};
