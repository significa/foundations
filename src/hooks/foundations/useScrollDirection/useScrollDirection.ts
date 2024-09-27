import { useEffect, useRef, useState } from 'react';
import { throttle } from 'lib/utils/throttle';

type ScrollDirection = 'up' | 'down';

type Scope = React.RefObject<HTMLElement> | undefined;

export function useScrollDirection(scope?: Scope): ScrollDirection | undefined {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);

  useEffect(() => {
    const unobserve = createScrollDirectionObserver(scope?.current, (dir: ScrollDirection) =>
      setScrollDirection(dir)
    );

    return () => unobserve();
  }, [scope]);

  return scrollDirection;
}

export function useScrollDirectionRef(
  scope?: Scope
): React.MutableRefObject<ScrollDirection | undefined> {
  const scrollDirection = useRef<ScrollDirection>(null);

  useEffect(() => {
    const unobserve = createScrollDirectionObserver(
      scope?.current,
      (dir: ScrollDirection) => (scrollDirection.current = dir)
    );

    return () => unobserve();
  }, [scope]);

  return scrollDirection;
}

function createScrollDirectionObserver(
  scope: HTMLElement | Window = window,
  onChange: (direction: ScrollDirection) => void
): () => void {
  const scroller = scope instanceof Window ? scope : getClosestScrollableParent(scope);

  let previousScrollY = Infinity;

  function onScroll() {
    console.log('on-scroll!');
    const currentScrollY =
      scroller instanceof Window
        ? window.scrollY || document.documentElement.scrollTop
        : scroller.scrollTop;

    if (currentScrollY > previousScrollY) {
      onChange('down');
    } else if (currentScrollY < previousScrollY) {
      onChange('up');
    }

    previousScrollY = currentScrollY;
  }

  const _onScroll = throttle(onScroll, 128);
  scroller.addEventListener('scroll', _onScroll, { passive: true });

  return () => scroller.removeEventListener('scroll', _onScroll);
}

function getClosestScrollableParent(element: HTMLElement | null): HTMLElement {
  const visited = new Set<HTMLElement>();

  while (element) {
    if (visited.has(element)) {
      return null;
    }

    if (element.scrollHeight > element.clientHeight) {
      return element;
    }

    visited.add(element);
    element = element.parentElement;
  }

  return null;
}
