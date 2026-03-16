import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/classnames";

type TableOfContentsProps = {
  headings: {
    text: string;
    depth: number;
    slug: string;
  }[];
};

const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const [activeSlug, setActiveSlug] = useState(headings[0]?.slug ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        });
      },
      { rootMargin: "-56px 0px -80%" } // header height 56px
    );

    const headingElements = headings.map(({ slug }) => document.getElementById(slug));

    headingElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  return (
    <div className="flex flex-col items-start">
      {headings.map(({ slug, depth, text }) => (
        <a
          className={cn(
            "ml-[max(0px,calc(--spacing(4)*var(--level)))] inline-block py-0.5 opacity-60 transition",
            activeSlug === slug && "opacity-100"
          )}
          key={slug}
          href={`#${slug}`}
          style={{ "--level": depth - 2 }}
        >
          {text}
        </a>
      ))}
    </div>
  );
};

export { TableOfContents };
