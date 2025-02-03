import { useEffect, useState, useRef, RefObject } from "react";

type ScrollProgressCallback = (
  scrollLeft: number,
  width: number,
  scrollWidth: number,
  progress: number
) => void;

export const useScrollProgress = (
  ref: RefObject<HTMLDivElement>,
  callback?: ScrollProgressCallback
) => {
  const [state, setState] = useState({
    scrollLeft: 0,
    width: 0,
    scrollWidth: 0,
    progress: 0,
  });

  const scrollRef = ref.current;

  const callbackRef = useRef<ScrollProgressCallback | undefined>(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!scrollRef) return;

    const updateScrollProgress = () => {
      const scrollLeft = scrollRef.scrollLeft;
      const width = scrollRef.clientWidth;
      const scrollWidth = scrollRef.scrollWidth;
      const progress = scrollRef.scrollLeft / scrollRef.scrollWidth; // normalized value between 0-1

      if (callbackRef.current) {
        callbackRef.current(scrollLeft, width, scrollWidth, progress);
      } else {
        setState({
          scrollLeft,
          width,
          scrollWidth,
          progress,
        });
      }
    };

    scrollRef.addEventListener("scroll", updateScrollProgress);
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      window.removeEventListener("resize", updateScrollProgress);
      scrollRef.removeEventListener("scroll", updateScrollProgress);
    };
  }, [scrollRef]);

  return state;
};

// const state = useScrollProgress(ref);
// console.log("rerender");

// useScrollProgress(ref, (state) => {
//    lineRef.width = state.progress
// });
