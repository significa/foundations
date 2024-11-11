import { useRef } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useElementRect } from '@/foundations/hooks/useElementRect';
import { cn } from '@/lib/tailwind';

export const HorizontalScrollSection = () => {
  const root = useRef(null);
  const content = useRef(null);

  const { width: contentWidth } = useElementRect(content);
  const { scrollYProgress } = useScroll({ target: root });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (content.current) {
      content.current.style.setProperty('--scroll-progress', value);
    }
  });

  return (
    <div className="my-[50vh]">
      <section ref={root} className="h-[300vh]" style={{ height: `${contentWidth}px` }}>
        <div className="w-screen h-screen sticky top-0 overflow-hidden">
          <div
            ref={content}
            style={{ transform: 'translateX(calc((-100% + 100vw) * var(--scroll-progress)))' }}
            className="w-max h-full flex"
          >
            {new Array(7).fill(null).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-64 h-full p-4 font-semibold',
                  i % 2 === 0 ? 'bg-foreground/20' : 'bg-foreground/30'
                )}
              >
                {i}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
