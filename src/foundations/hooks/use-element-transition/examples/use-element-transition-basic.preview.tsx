"use client";

import { useState } from "react";

import { Button } from "@/foundations/ui/button/button";
import { cn } from "@/lib/utils";

import { useElementTransition } from "../use-element-transition";

function UseElementTransitionDefaultPreview() {
  const [toggled, setToggled] = useState(false);

  const { ref, isMounted, status } =
    useElementTransition<HTMLDivElement>(toggled);

  return (
    <div className="relative">
      <Button onClick={() => setToggled((v) => !v)}>Toggle Box</Button>

      {isMounted && (
        <div
          ref={ref}
          data-status={status}
          className={cn(
            "absolute mt-2 aspect-square w-full rounded-md bg-amber-200",
            "transition-all duration-300 ease-in-out motion-reduce:transition-none",
            "data-[status=initial]:translate-y-full data-[status=initial]:opacity-0",
            "data-[status=closed]:scale-0 data-[status=closed]:rotate-180 data-[status=closed]:opacity-0"
          )}
        />
      )}
    </div>
  );
}

export default UseElementTransitionDefaultPreview;
