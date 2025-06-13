"use client";

import { debounce } from "@/foundations/utils/debounce/debounce";
import { useRef, useState, useEffect } from "react";

export const useBreakpoint = (query: string) => {
  const [matches, setMatches] = useState<boolean>(false);
  const mediaQueryRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    mediaQueryRef.current = window.matchMedia(query);
    const handleChange = debounce(
      () => setMatches(mediaQueryRef.current?.matches || false),
      100
    );

    // Set initial value based on the current window size
    setMatches(mediaQueryRef.current.matches);

    mediaQueryRef.current.addEventListener("change", handleChange);

    return () =>
      mediaQueryRef.current?.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};

export const useMobile = () => useBreakpoint("(max-width: 600px)");
export const useTablet = () => useBreakpoint("(max-width: 768px)");
export const useDesktop = () => useBreakpoint("(min-width: 1024px)");
