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

interface StyleBackup {
  overflow: string;
  scrollbarGutter: string;
}

const styleBackupMap = new WeakMap<HTMLElement, StyleBackup>();
const lockCounterMap = new WeakMap<HTMLElement, number>();

export const useScrollLock = (isLocked: boolean, target?: ScrollLockTarget) => {
  const targetElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    targetElementRef.current = getTargetElement(target);
  }, [target]);

  useEffect(() => {
    const targetElement = targetElementRef.current;
    if (!targetElement || !isLocked) return;

    const currentCount = lockCounterMap.get(targetElement) || 0;

    // Backup styles before first lock
    if (currentCount === 0) {
      styleBackupMap.set(targetElement, {
        overflow: targetElement.style.overflow,
        scrollbarGutter: targetElement.style.scrollbarGutter,
      });
    }

    const newCount = currentCount + 1;
    lockCounterMap.set(targetElement, newCount);

    Object.assign(targetElement.style, {
      overflow: "hidden",
      scrollbarGutter: "stable",
    });

    return () => {
      const currentCount = lockCounterMap.get(targetElement) || 0;
      const newCount = Math.max(0, currentCount - 1);
      lockCounterMap.set(targetElement, newCount);

      if (newCount === 0) {
        const previousStyles = styleBackupMap.get(targetElement) || {
          overflow: "",
          scrollbarGutter: "",
        };

        Object.assign(targetElement.style, previousStyles);
        styleBackupMap.delete(targetElement);
      }
    };
  }, [isLocked]);
};
