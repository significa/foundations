import { lerp } from "@/foundations/utils/math/lerp";
import { useEffect, useRef } from "react";

const VELOCITY_MOMENTUM_FACTOR = 10;
const DRAG_EASE = 1;
const MOMENTUM_EASE = 0.1;
const SETTLED_THRESHOLD = 0.01;

export const useMousePan = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let hasSnap = false;
    let isPanning = false;
    let rafId: number | null = null;

    const mouse = {
      initial: { x: 0, y: 0 },
    };

    const scroll = {
      initial: { x: 0, y: 0 },
      current: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      axis: { x: false, y: false },
    };

    // on pan finish (when it fully settles)
    const onPanFinish = () => {
      element.style.removeProperty("scroll-snap-type");
    };

    const cancelTick = () => {
      if (!rafId) return;
      window.cancelAnimationFrame(rafId);
      rafId = null;
    };

    const requestTick = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(tick);
    };

    const tick = () => {
      rafId = null;

      const previousScroll = { ...scroll.current };

      // update the current scroll position, using the appropriate ease factor
      const ease = isPanning ? DRAG_EASE : MOMENTUM_EASE;
      scroll.current = {
        x: lerp(scroll.current.x, scroll.target.x, ease),
        y: lerp(scroll.current.y, scroll.target.y, ease),
      };

      // calculate the velocity of the scroll
      scroll.velocity = {
        x: scroll.current.x - previousScroll.x,
        y: scroll.current.y - previousScroll.y,
      };

      // update the scroll position if the axis is enabled
      if (scroll.axis.x) element.scrollLeft = scroll.current.x;
      if (scroll.axis.y) element.scrollTop = scroll.current.y;

      // if the target is hit, settle the scroll position, otherwise request another tick
      if (
        Math.abs(scroll.current.x - scroll.target.x) < SETTLED_THRESHOLD &&
        Math.abs(scroll.current.y - scroll.target.y) < SETTLED_THRESHOLD
      ) {
        scroll.current.x = Math.ceil(scroll.target.x);
        scroll.current.y = Math.ceil(scroll.target.y);
        element.scrollLeft = scroll.current.x;
        element.scrollTop = scroll.current.y;

        if (!isPanning) {
          onPanFinish();
        }
      } else {
        requestTick();
      }
    };

    // on pan start
    const onMouseDown = (event: MouseEvent) => {
      isPanning = true;

      // remove snap if it exists, because it prevents setting scroll positions
      element.style.removeProperty("scroll-snap-type");
      hasSnap = window.getComputedStyle(element).scrollSnapType !== "none";
      if (hasSnap) element.style.setProperty("scroll-snap-type", "none");

      mouse.initial = {
        x: event.pageX - element.offsetLeft,
        y: event.pageY - element.offsetTop,
      };

      scroll.axis = {
        x: element.scrollWidth > element.clientWidth,
        y: element.scrollHeight > element.clientHeight,
      };

      // reset the state and cancel any active momentum
      scroll.initial = { x: element.scrollLeft, y: element.scrollTop };
      scroll.target = { ...scroll.initial };
      scroll.current = { ...scroll.initial };
      scroll.velocity = { x: 0, y: 0 };
      cancelTick();
    };

    // on pan
    const onMouseMove = (event: MouseEvent) => {
      if (!isPanning) return;
      event.stopPropagation();

      const currentMouseX = event.pageX - element.offsetLeft;
      const currentMouseY = event.pageY - element.offsetTop;

      const walkX = currentMouseX - mouse.initial.x;
      const walkY = currentMouseY - mouse.initial.y;

      scroll.target = {
        x: scroll.initial.x - walkX,
        y: scroll.initial.y - walkY,
      };

      requestTick();
    };

    // on pan end
    const onMouseUp = () => {
      if (!isPanning) return;
      isPanning = false;

      // add velocity to the target scroll to simulate momentum
      const blindScrollTarget = {
        x: scroll.target.x + scroll.velocity.x * VELOCITY_MOMENTUM_FACTOR,
        y: scroll.target.y + scroll.velocity.y * VELOCITY_MOMENTUM_FACTOR,
      };

      // if snap is enabled, compute the target scroll position using FLIP
      // https://www.nan.fyi/magic-motion#introducing-flip
      if (hasSnap) {
        const clone = element.cloneNode(true) as HTMLDivElement;
        clone.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;width:${element.clientWidth}px;height:${element.clientHeight}px;`;
        element.parentElement?.appendChild(clone);
        clone.scrollLeft = blindScrollTarget.x;
        clone.scrollTop = blindScrollTarget.y;
        scroll.target = { x: clone.scrollLeft, y: clone.scrollTop };
        clone.remove();

        // The following doesn't work on safari, but let's keep an eye on it because its a better and less convoluted approach
        /* 
          const currentScrollLeft = element.scrollLeft;
          element.scrollLeft = blindTargetScrollLeft;
          element.style.removeProperty("scroll-snap-type");
          GET SCROLL POSITION -> element.scrollLeft, element.scrollTop
          element.style.setProperty("scroll-snap-type", "none"); 
         */
      } else {
        scroll.target = { ...blindScrollTarget };
      }

      const requiresTick =
        scroll.current.x !== scroll.target.x ||
        scroll.current.y !== scroll.target.y;
      if (!requiresTick) return onPanFinish();

      requestTick();
    };

    // stop all pan behavior when user attempts to scroll — native scrolling should take precedence
    const onWheel = () => {
      cancelTick();
      onPanFinish();

      scroll.velocity = { x: 0, y: 0 };
      scroll.current = { x: element.scrollLeft, y: element.scrollTop };
    };

    const abortController = new AbortController();
    const signal = abortController.signal;
    element.addEventListener("mousedown", onMouseDown, { signal });
    element.addEventListener("mousemove", onMouseMove, { signal });
    element.addEventListener("mouseup", onMouseUp, { signal });
    element.addEventListener("mouseleave", onMouseUp, { signal });
    element.addEventListener("wheel", onWheel, { signal });

    return () => {
      cancelTick();
      abortController.abort();
    };
  }, []);

  return { ref };
};
