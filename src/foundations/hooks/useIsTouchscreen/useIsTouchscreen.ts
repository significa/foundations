import { useState, useEffect } from 'react';

export function useIsTouchscreen(): boolean {
  const [isTouchscreen, setIsTouchscreen] = useState<boolean>(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    setIsTouchscreen(mediaQuery.matches);

    function updateTouchscreenStatus(e: MediaQueryListEvent) {
      setIsTouchscreen(e.matches);
    }

    mediaQuery.addEventListener('change', updateTouchscreenStatus);

    return () => {
      mediaQuery.removeEventListener('change', updateTouchscreenStatus);
    };
  }, []);

  return isTouchscreen;
}
