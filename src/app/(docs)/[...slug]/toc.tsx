"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export const TableOfContents = ({
  headings,
}: {
  headings: { text: string; level: number; id: string }[];
}) => {
  const [activeSlug, setActiveSlug] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        });
      },
      { rootMargin: "-56px 0px -80%" }
    );

    const headingElements = headings.map(({ id }) =>
      document.getElementById(id)
    );

    headingElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  return (
    <div className="flex flex-col items-start">
      {headings.map(({ id, level, text }) => (
        <a
          className={cn(
            "inline-block ml-[max(0px,calc(var(--spacing)*4*var(--level)))] py-0.5 opacity-60 transition",
            activeSlug === id && "opacity-100"
          )}
          key={id}
          href={`#${id}`}
          style={{ "--level": level - 2 }}
        >
          {text}
        </a>
      ))}
    </div>
  );
};
