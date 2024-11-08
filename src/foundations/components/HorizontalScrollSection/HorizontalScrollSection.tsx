import { PreviewBox } from '@/components/PreviewBox';
import { useRef } from 'react';
import { cn } from '@/lib/tailwind';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useParentRef } from '@/foundations/hooks/useParentRef';
import { useElementRect } from '@/foundations/hooks/useElementRect';

export function HorizontalScrollSection() {
  const root = useRef(null);
  const content = useRef(null);
  const parentRef = useParentRef(root);
  const { width } = useElementRect(parentRef);
  const { width: contentWidth } = useElementRect(content);

  const { scrollYProgress } = useScroll({
    target: root,
    layoutEffect: false,
    container: parentRef,
    offset: ['start start', 'end end']
  });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (content.current && width) {
      content.current.style.transform = `translateX(calc((-100% + ${width}px) * ${value}))`;
    }
  });

  return (
    <PreviewBox className="block h-[24rem] p-0 overflow-scroll overscroll-contain">
      <div className="mt-4 w-full text-center">Scroll ↓</div>
      <div className="h-[18rem]" />
      <section ref={root} className="h-[24rem]" style={{ height: `${contentWidth}px` }}>
        <div className="w-full h-[24rem] sticky top-0 overflow-hidden">
          <div ref={content} className="w-max h-full flex">
            {new Array(7).fill(null).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-64 h-full p-4 font-semibold',
                  i % 2 === 0 ? 'bg-primary/20' : 'bg-primary/30'
                )}
              >
                {i}
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="h-[18rem]" />
    </PreviewBox>
  );
}
