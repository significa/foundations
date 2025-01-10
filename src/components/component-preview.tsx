"use client";

import { useRef } from "react";
import { useInView } from "motion/react";

import { cn } from "@/lib/utils";

export const ComponentPreview = ({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref}>
      {isInView ? (
        <iframe
          className={cn(
            "w-full h-[400px] rounded-xl border border-border",
            className
          )}
          src={`/preview/${slug}`}
        />
      ) : (
        <div className="w-full h-[400px] rounded-xl border border-border" />
      )}
    </div>
  );
};
