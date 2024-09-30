import { useLayoutEffect, useEffect, useState, useMemo } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { cn } from 'lib/tailwind';
import { matchesQuerySelector } from 'lib/utils/matchesQuerySelector';
import { useScrollDirectionRef } from 'hooks/foundations/useScrollDirection';

interface TableOfContentsProps extends React.HTMLAttributes<HTMLElement> {
  scope?: React.RefObject<HTMLElement>;
  headingSelectors?: {
    h2: string;
    h3?: string;
    h4?: string;
  };
}

interface HeadingItem {
  element: HTMLElement;
  content: string;
  depth: number;
}

const DEFAULT_HEADING_SELECTORS = { h2: 'h2', h3: 'h3', h4: 'h4' };

export function TableOfContents({
  scope,
  headingSelectors = DEFAULT_HEADING_SELECTORS,
  className
}: TableOfContentsProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  const scrollDirection = useScrollDirectionRef(scope);

  const headings = useMemo<HeadingItem[]>(() => {
    if (!mounted) return [];

    const root = scope?.current || document.body;

    const query = Object.values(headingSelectors).join(', ');
    const elements: HTMLElement[] = Array.from(root.querySelectorAll(query));

    return elements.map((element) => ({
      element,
      depth: getDepthFromHeading(
        Object.entries(headingSelectors).find(([, selector]) =>
          matchesQuerySelector(element, selector)
        )?.[0]
      ),
      content: element.innerText
    }));
  }, [mounted, scope, headingSelectors]);

  useLayoutEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const options = {
      root: null,
      rootMargin: '0px 0px -50% 0px',
      threshold: 0
    };

    function onIntersection(entries: any[]) {
      for (let i = 0; i < entries.length; i++) {
        const { isIntersecting, target } = entries[i];
        const itemIndex = headings.findIndex(({ element }) => element === target);

        if (isIntersecting) {
          setActiveItemIndex(itemIndex);
        } else {
          if (scrollDirection.current === 'up') {
            setActiveItemIndex(itemIndex > 0 ? itemIndex - 1 : -1);
          } else if (scrollDirection.current === 'down' && itemIndex === headings.length - 1) {
            setActiveItemIndex(-1);
          }
        }
      }
    }

    const observer = new IntersectionObserver(onIntersection, options);
    headings.forEach(({ element }) => observer.observe(element));

    return () => {
      headings.forEach(({ element }) => observer.unobserve(element));
      observer.disconnect();
    };
  }, [headings]);

  return (
    <nav className={cn('relative text-sm', className)}>
      <ol className="flex flex-col gap-1">
        {headings.map(({ element, content, depth }, index) => (
          <li key={index}>
            <button
              aria-current={index === activeItemIndex}
              className={cn(
                'max-w-[20em] truncate text-left text-primary/50 pr-4 aria-[current=false]:hover:text-primary/80 transition-colors',
                index === activeItemIndex && 'text-primary',
                depth === 1 && 'pl-4',
                depth === 2 && 'pl-8',
                depth === 3 && 'pl-12'
              )}
              onClick={() => scrollIntoView(element, { behavior: 'smooth' })}
            >
              {content}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function getDepthFromHeading(tag: string): number {
  switch (tag) {
    case 'h2':
      return 0;
    case 'h3':
      return 1;
    case 'h4':
      return 2;
    default:
      return 0;
  }
}
