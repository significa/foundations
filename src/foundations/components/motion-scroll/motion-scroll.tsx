import {
  type DOMKeyframesDefinition,
  type Easing,
  scroll,
  type UseScrollOptions,
  useAnimate,
  useReducedMotion,
} from "motion/react";
import { type ComponentPropsWithRef, useEffect, useRef } from "react";
import { Slot } from "@/foundations/components/slot/slot";
import { useMatchMedia } from "@/foundations/hooks/use-match-media/use-match-media";
import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";

type MotionScrollProps = ComponentPropsWithRef<"div"> & {
  keyframes: DOMKeyframesDefinition;
  hooks?: {
    onStart?: () => void;
    onComplete?: () => void;
    onUpdate?: (progress: number) => void;
  };
  offset?: UseScrollOptions["offset"];
  ease?: Easing;
  scroller?: (element: HTMLElement) => Element;
  trigger?: (element: HTMLElement) => Element;
  asChild?: boolean;
  axis?: "x" | "y";
  touchscreen?: boolean;
};

/**
 * A component that animates its children based on scroll position.
 * Extends the `motion` library's `scroll` and `animate` API.
 */
const MotionScroll = ({
  keyframes,
  hooks = {},
  offset = ["start end", "end start"],
  ease = "linear",
  axis = "y",
  scroller,
  trigger,
  asChild,
  ref: propRef,
  children,
  touchscreen = false,
  ...rest
}: MotionScrollProps) => {
  const [scope, animate] = useAnimate();
  const isReducedMotion = useReducedMotion();
  const isTouchscreen = useMatchMedia("(pointer: coarse)", true);
  const hooksRef = useRef(hooks);
  hooksRef.current = hooks;

  useEffect(() => {
    const element = scope.current;
    if (!element) return;
    if (!touchscreen && isTouchscreen) return;
    if (isReducedMotion) return;
    if (Object.keys(keyframes).length === 0) return;

    const scrollOptions = {
      target: trigger ? trigger(element) : element,
      container: scroller ? scroller(element) : undefined,
      offset,
      axis,
    };

    const animation = animate(element, keyframes, { autoplay: false, ease });
    const destroyScrollAnimation = scroll(animation, scrollOptions);

    let previousProgress: number | null = null;
    const destroyScrollProgress = scroll((progress: number) => {
      if (progress === previousProgress) return;

      if ((previousProgress === null || previousProgress === 0) && progress > 0) {
        hooksRef.current.onStart?.();
      }

      if ((previousProgress ?? 0) < 1 && progress === 1) {
        hooksRef.current.onComplete?.();
      }

      hooksRef.current.onUpdate?.(progress);
      previousProgress = progress;
    }, scrollOptions);

    return () => {
      animation.cancel();
      destroyScrollAnimation();
      destroyScrollProgress();
    };
  }, [
    scope,
    animate,
    ease,
    keyframes,
    isTouchscreen,
    axis,
    offset,
    scroller,
    trigger,
    touchscreen,
    isReducedMotion,
  ]);

  const Component = asChild ? Slot : "div";
  return (
    <Component ref={composeRefs(scope, propRef)} {...rest}>
      {children}
    </Component>
  );
};

export { MotionScroll };
