"use client";
import { useMousePan } from "../use-mouse-pan";
import { cn } from "@/lib/utils";

const UseMousePanPreview = () => {
  const { ref } = useMousePan<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="w-128 cursor-grab snap-x snap-mandatory overflow-x-auto active:cursor-grabbing"
    >
      <ul className="flex size-max gap-2">
        {new Array(12).fill(0).map((_, index) => (
          <li
            key={index}
            className={cn(
              "no-select bg-foreground-secondary/15 h-32 w-64 snap-center rounded-sm",
              index % 2 === 0 && "bg-foreground-secondary/30"
            )}
          />
        ))}
      </ul>
    </div>
  );
};

export default UseMousePanPreview;
