import { useEffect, useRef, useState } from "react";

export const useMatchMedia = (query: string) => {
  const [matches, setMatches] = useState(false);
  const mediaQueryRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    mediaQueryRef.current = window.matchMedia(query);

    const handleChange = () =>
      setMatches(mediaQueryRef.current?.matches || false);

    setMatches(mediaQueryRef.current.matches);
    mediaQueryRef.current.addEventListener("change", handleChange);

    return () =>
      mediaQueryRef.current?.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};
