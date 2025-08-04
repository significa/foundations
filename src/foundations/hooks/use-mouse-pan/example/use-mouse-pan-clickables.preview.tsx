"use client";

import { useMousePan } from "@/foundations/hooks/use-mouse-pan/use-mouse-pan";
import { cn } from "@/lib/utils";

const UseMousePanClickables = () => {
  const { ref } = useMousePan<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="w-full max-w-lg cursor-grab overflow-x-auto **:cursor-grab active:cursor-grabbing active:**:cursor-grabbing"
    >
      <ul className="flex size-max gap-2">
        {new Array(12).fill(0).map((_, index) => (
          <li
            key={index}
            className={cn(
              "no-select bg-muted-foreground/15 size-32 rounded-sm",
              index % 2 === 0 && "bg-muted-foreground/30"
            )}
          >
            <button
              className="size-full text-sm"
              onClick={() => window.alert("click")}
            >
              [button]
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UseMousePanClickables;
