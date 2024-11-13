import { useMemo, useEffect, useCallback, useRef } from 'react';
import { useScroll, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/tailwind';
import { useViewport } from '@/foundations/hooks/useViewport';
import { useIsTouchscreen } from '@/foundations/hooks/useIsTouchscreen';
import { useIsMounted } from '@/foundations/hooks/useIsMounted';

type ParallaxProps = React.HTMLAttributes<HTMLDivElement> & {
  speed: number;
};

export function ParallaxTransform({ speed, className, children, ...rest }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>();
  const windowHeight = useRef(0);
  const normScreenOffset = useMemo(() => 1 - 1 / speed, [speed]);

  const elementScroll = useScroll({
    target: ref,
    offset: [`start ${100 - normScreenOffset * 100}vh`, `end ${0 + normScreenOffset * 100}vh`]
  });

  const updateTranslate = useCallback(
    (scrollProgress: number) => {
      const element = ref.current;
      if (!element) return;

      const pxOffset = normScreenOffset * windowHeight.current;
      const progress = (-0.5 + scrollProgress) * 2;

      element.style.transform = `translateY(${-pxOffset * progress}px)`;
    },
    [normScreenOffset]
  );

  useViewport({
    onResize: ({ height }) => (windowHeight.current = height)
  });

  useEffect(() => {
    updateTranslate(0);

    return elementScroll.scrollYProgress.on('change', updateTranslate);
  }, [elementScroll.scrollYProgress, updateTranslate]);

  return (
    <div
      {...rest}
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn('will-change-transform', className)}
    >
      {children}
    </div>
  );
}

export function Parallax({ speed, ...rest }: ParallaxProps) {
  const isTouchscreen = useIsTouchscreen();
  const shouldReduceMotion = useReducedMotion();
  const isMounted = useIsMounted();

  if (speed === 1 || isTouchscreen || shouldReduceMotion || !isMounted) {
    return <div {...rest} />;
  }

  return <ParallaxTransform {...rest} speed={speed} />;
}
