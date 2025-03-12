import { lerp } from "@/foundations/utils/math/lerp";
import { useEffect, useRef } from "react";

const VELOCITY_MOMENTUM_FACTOR = 15; // multiplier for velocity added to the target scroll when pan is released
const DRAG_EASE = 1; // ease factor when holding and panning (1 = no ease)
const MOMENTUM_EASE = 0.09; // ease factor for when the pan is released
const SETTLED_THRESHOLD = 0.01; // threshold for considering the scroll position as settled

type Vector2D = { x: number; y: number };

type MouseState = {
  initial: Vector2D;
};

type ScrollState = {
  initial: Vector2D;
  current: Vector2D;
  target: Vector2D;
  velocity: Vector2D;
  axis: { x: boolean; y: boolean };
};

export const useMousePan = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const cancelCurrentRef = useRef<() => void>(() => {});

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let hasSnap = false;
    let isPanning = false;
    let rafId: number | null = null;

    const mouse: MouseState = {
      initial: { x: 0, y: 0 },
    };

    const scroll: ScrollState = {
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
      if (rafId) cancelTick();
      rafId = window.requestAnimationFrame(tick);
    };

    const tick = () => {
      rafId = null;

      const previousScroll = { ...scroll.current };
      const ease = isPanning ? DRAG_EASE : MOMENTUM_EASE;

      // lerp to the new scroll position using the appropriate ease factor
      scroll.current = {
        x: lerp(scroll.current.x, scroll.target.x, ease),
        y: lerp(scroll.current.y, scroll.target.y, ease),
      };

      // calculate the velocity of the scroll
      scroll.velocity = {
        x: scroll.current.x - previousScroll.x,
        y: scroll.current.y - previousScroll.y,
      };

      const isSettled =
        Math.abs(scroll.current.x - scroll.target.x) < SETTLED_THRESHOLD &&
        Math.abs(scroll.current.y - scroll.target.y) < SETTLED_THRESHOLD;

      // if is settled, set the current scroll to ceiled target scroll
      // avoids small jitter when the target is hit and the scroll position is a decimal number
      if (isSettled) {
        scroll.current = {
          x: Math.ceil(scroll.target.x),
          y: Math.ceil(scroll.target.y),
        };

        // being settled and not panning means we've reached the end of this current pan animation
        if (!isPanning) onPanFinish();
      }

      // update the scroll position if the axis is enabled
      if (scroll.axis.x) element.scrollLeft = scroll.current.x;
      if (scroll.axis.y) element.scrollTop = scroll.current.y;

      // request another tick if the scroll is not settled
      if (!isSettled) requestTick();
    };

    // on pan start
    const onMouseDown = (event: MouseEvent) => {
      isPanning = true;

      // check if the element has snap
      element.style.removeProperty("scroll-snap-type");
      hasSnap = window.getComputedStyle(element).scrollSnapType !== "none";

      // remove snap if it exists, because it prevents setting scroll positions
      if (hasSnap) element.style.setProperty("scroll-snap-type", "none");

      mouse.initial = {
        x: event.pageX - element.offsetLeft,
        y: event.pageY - element.offsetTop,
      };

      scroll.axis = {
        x: element.scrollWidth > element.clientWidth,
        y: element.scrollHeight > element.clientHeight,
      };

      scroll.initial = {
        x: element.scrollLeft,
        y: element.scrollTop,
      };

      // reset the state and cancel any active momentum
      scroll.target = { ...scroll.initial };
      scroll.current = { ...scroll.initial };
      scroll.velocity = { x: 0, y: 0 };
      cancelTick();
    };

    // on pan
    const onMouseMove = (event: MouseEvent) => {
      if (!isPanning) return;

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
    const onMouseUp = async () => {
      if (!isPanning) return;
      isPanning = false;

      // add velocity to the target scroll to simulate momentum
      const unsnappedScrollTarget = {
        x: scroll.target.x + scroll.velocity.x * VELOCITY_MOMENTUM_FACTOR,
        y: scroll.target.y + scroll.velocity.y * VELOCITY_MOMENTUM_FACTOR,
      };

      // if snap is enabled, compute the target scroll position using (a sort of) FLIP
      // https://www.nan.fyi/magic-motion#introducing-flip
      if (hasSnap) {
        const cloneContainer = document.createElement("div");
        cloneContainer.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;`;

        const clone = element.cloneNode(true) as HTMLDivElement;
        clone.style.cssText = `width:${element.clientWidth}px;height:${element.clientHeight}px;`;

        cloneContainer.appendChild(clone);
        (element.parentElement ?? element).appendChild(cloneContainer);

        // we're relying on the fact that a scroll-snap element instants snaps to the target position when its scrollLeft or scrollTop are updated
        clone.scrollLeft = unsnappedScrollTarget.x;
        clone.scrollTop = unsnappedScrollTarget.y;
        scroll.target = { x: clone.scrollLeft, y: clone.scrollTop };
        cloneContainer.remove();

        // This doesn't work consistently on safari, but let's keep an eye on it because its a better and less convoluted approach
        /* 
          const currentScroll = { x: element.scrollLeft, y: element.scrollTop };
          element.style.removeProperty("scroll-snap-type");
          element.scrollLeft = unsnappedScrollTarget.x;
          element.scrollTop = unsnappedScrollTarget.y;
          scroll.target = { x: element.scrollLeft, y: element.scrollTop };
          element.style.setProperty("scroll-snap-type", "none");
          element.scrollLeft = currentScroll.x;
          element.scrollTop = currentScroll.y;
         */
      } else {
        scroll.target = { ...unsnappedScrollTarget };
      }

      // if the target is already hit, settle the scroll position, otherwise request another tick
      if (
        scroll.current.x === scroll.target.x &&
        scroll.current.y === scroll.target.y
      ) {
        onPanFinish();
      } else {
        requestTick();
      }
    };

    // cancel all pan behavior and animation
    const cancelCurrent = () => {
      cancelTick();
      onPanFinish();

      scroll.velocity = { x: 0, y: 0 };
      scroll.current = { x: element.scrollLeft, y: element.scrollTop };
    };
    cancelCurrentRef.current = cancelCurrent;

    const abortController = new AbortController();
    const signal = abortController.signal;
    element.addEventListener("mousedown", onMouseDown, { signal });
    element.addEventListener("mousemove", onMouseMove, { signal });
    element.addEventListener("mouseup", onMouseUp, { signal });
    element.addEventListener("mouseleave", onMouseUp, { signal });
    element.addEventListener("wheel", cancelCurrent, { signal });

    return () => {
      cancelCurrentRef.current = () => {};

      abortController.abort();
      cancelTick();
      onPanFinish();
    };
  }, []);

  return {
    ref,
    cancelCurrent: () => cancelCurrentRef.current(),
  };
};
