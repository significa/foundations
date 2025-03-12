"use client";

import {
  Children,
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  InstanceCounterProvider,
  useInstanceCounter,
} from "@/foundations/components/instance-counter/instance-counter";
import { useIntersectionObserver } from "@/foundations/hooks/use-intersection-observer/use-intersection-observer";
import { useMousePan } from "@/foundations/hooks/use-mouse-pan/use-mouse-pan";
import { clamp } from "@/foundations/utils/math/clamp";
import { Button } from "@/foundations/ui/button/button";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    title: "Ocean Waves",
    description: "Powerful waves crash against a rocky coastline at sunset",
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=960&auto=format&fit=crop",
  },
  {
    title: "Forest Trail",
    description:
      "A winding path through an ancient forest filled with towering trees",
    image:
      "https://images.unsplash.com/photo-1595514807053-2c594370091a?q=80&w=960&auto=format&fit=crop",
  },
  {
    title: "Desert Dunes",
    description: "Rolling sand dunes stretching endlessly toward the horizon",
    image:
      "https://images.unsplash.com/photo-1498144668414-48bf526766cf?q=80&w=960&auto=format&fit=crop",
  },
  {
    title: "Mountain Sunrise",
    description: "A breathtaking view of the sun rising over misty peaks",
    image:
      "https://images.unsplash.com/photo-1736525155507-2326a56f0606?q=80&w=960&auto=format&fit=crop",
  },
];

const CarouselContext = createContext<{
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}>({ activeIndex: 0, setActiveIndex: () => {} });

const Carousel = ({ children }: { children: ReactNode }) => {
  const { ref, cancelCurrent } = useMousePan<HTMLDivElement>();

  const [activeIndex, setActiveIndex] = useState(0);
  const numItems = useMemo(() => Children.count(children), [children]);

  const to = (newIndex: number) => {
    if (!ref.current) return;
    const next = clamp(0, newIndex, numItems - 1);

    const child = ref.current.firstElementChild?.children[next];
    if (!child || !(child instanceof HTMLElement)) return;

    cancelCurrent();
    ref.current.scrollTo({
      left: child.offsetLeft - ref.current.offsetLeft,
      behavior: "smooth",
    });
  };

  return (
    <CarouselContext value={{ activeIndex, setActiveIndex }}>
      <InstanceCounterProvider>
        <div>
          {/* Scroller */}
          <div
            ref={ref}
            className="w-full max-w-112 cursor-grab snap-x snap-mandatory overflow-x-auto overscroll-contain rounded-sm active:cursor-grabbing"
          >
            <ul
              className="grid size-max w-full grid-cols-[repeat(var(--num-items),100%)] gap-2"
              style={{ "--num-items": numItems }}
            >
              {Children.map(children, (child) => (
                <li className="aspect-[3/2] w-full snap-center overflow-hidden rounded-sm select-none">
                  {child}
                </li>
              ))}
            </ul>
          </div>

          {/* Controls */}
          <div className="mt-3 flex w-full items-center gap-2">
            <Button
              disabled={activeIndex === 0}
              variant="ghost"
              size="sm"
              onClick={() => to(activeIndex - 1)}
            >
              ←
            </Button>
            <Button
              disabled={activeIndex === numItems - 1}
              variant="ghost"
              size="sm"
              onClick={() => to(activeIndex + 1)}
            >
              →
            </Button>
            <div className="ml-auto text-sm font-medium">
              {activeIndex + 1} / {numItems}
            </div>
          </div>
        </div>
      </InstanceCounterProvider>
    </CarouselContext>
  );
};

const CarouselItem = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => {
  const index = useInstanceCounter();
  const { activeIndex, setActiveIndex } = useContext(CarouselContext);
  const isActive = activeIndex === index;

  const [ref] = useIntersectionObserver<HTMLDivElement>(
    { threshold: 0.9 },
    (isIntersecting) => {
      if (isIntersecting) setActiveIndex(index);
    }
  );

  return (
    <div
      ref={ref}
      className="flex size-full items-end bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="text-md from-foreground/85 w-full bg-gradient-to-t to-transparent p-6 pt-32 pr-12 font-medium">
        <div
          className={cn(
            "text-background",
            isActive && "transition-all duration-500 ease-out",
            !isActive && "translate-y-6 opacity-0"
          )}
        >
          {title}
        </div>
        <div
          className={cn(
            "text-background/75",
            isActive && "transition-all delay-50 duration-500 ease-out",
            !isActive && "translate-y-6 opacity-0"
          )}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

const UseMousePanCarouselPreview = () => {
  return (
    <Carousel>
      {ITEMS.map((item, index) => (
        <CarouselItem
          key={index}
          title={item.title}
          description={item.description}
          image={item.image}
        />
      ))}
    </Carousel>
  );
};

export default UseMousePanCarouselPreview;
