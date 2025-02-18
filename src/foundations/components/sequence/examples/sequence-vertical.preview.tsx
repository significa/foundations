"use client";

import { cn } from "@/lib/utils";
import {
  Sequence,
  SequenceItem,
  SequenceItems,
  SequencePanel,
  SequencePanels,
} from "@/foundations/components/sequence/sequence";
import { eras as CONTENT } from "./content";

const SequenceVertical = () => {
  return (
    <Sequence
      orientation="vertical"
      loop
      className="flex max-w-128 gap-10"
      duration={3000}
    >
      <div className="flex gap-2">
        <div
          className={cn(
            "flex h-8 items-center transition-transform duration-300 ease-out",
            "translate-y-[calc(var(--index)*100%)]"
          )}
        >
          <div
            className={cn(
              "text-foreground relative h-3 w-3 rounded-full",
              "before:bg-foreground/10 before:absolute before:inset-0",
              "before:rounded-full before:content-['']"
            )}
            style={{
              "--fill": "calc(var(--progress) * 100%)",
              background: `conic-gradient(from 0deg at 50% 50%, currentColor var(--fill), transparent var(--fill))`,
            }}
          />
        </div>
        <SequenceItems>
          {CONTENT.map((item, index) => (
            <SequenceItem
              key={index}
              value={index.toString()}
              className={cn(
                "block h-8 text-left text-base font-medium",
                "text-foreground-secondary data-[selected=true]:text-foreground",
                "hover:text-foreground/60 active:text-foreground/80 cursor-pointer"
              )}
            >
              {item.title}
            </SequenceItem>
          ))}
        </SequenceItems>
      </div>
      <SequencePanels className="min-h-64">
        {CONTENT.map((item, index) => (
          <SequencePanel key={index} className="text-xl font-medium">
            {item.description}
          </SequencePanel>
        ))}
      </SequencePanels>
    </Sequence>
  );
};

export default SequenceVertical;
