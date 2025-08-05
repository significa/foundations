"use client";

import { useMousePan } from "@/foundations/hooks/use-mouse-pan/use-mouse-pan";
import { cn } from "@/lib/utils";

const UseMousePanBothPreview = () => {
  const { ref } = useMousePan<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="aspect-square h-full max-h-128 w-full max-w-lg cursor-grab snap-both snap-mandatory overflow-auto active:cursor-grabbing"
    >
      <ul className="grid size-max grid-cols-13 grid-rows-13">
        {new Array(169).fill(0).map((_, index) => (
          <li
            key={index}
            className={cn(
              "no-select bg-foreground-secondary/10 size-24 snap-center",
              index % 2 === 0 && "bg-foreground-secondary/30"
            )}
          />
        ))}
      </ul>
    </div>
  );
};

export default UseMousePanBothPreview;
