import { RefObject, useEffect, useMemo } from "react";

export type ScrollLockTarget =
  | string
  | HTMLElement
  | RefObject<HTMLElement>
  | undefined;

const getTargetElement = (target: ScrollLockTarget): HTMLElement | null => {
  if (typeof window === "undefined") return null;
  if (!target) return document.body;
  if (target instanceof HTMLElement) return target;
  if (typeof target === "string") return document.querySelector(target);
  if (target && "current" in target) return target.current || null;

  return null;
};

export const useScrollLock = (isLocked: boolean, target?: ScrollLockTarget) => {
  const targetElement = useMemo(() => getTargetElement(target), [target]);

  useEffect(() => {
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
  }, [isLocked, targetElement]);
};
