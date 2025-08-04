"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";
import { scrollIntoViewIfNeeded } from "@/foundations/utils/dom/scroll-into-view-if-needed";
import {
  Sequence,
  SequenceItem,
  SequencePanel,
  SequencePanels,
  SequenceItems,
} from "../sequence";
import { erasExtended as CONTENT } from "./content";

const SequenceScrollIntoView = () => {
  const itemsScrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <Sequence
      className="relative max-w-[min(90vw,640px)]"
      loop
      duration={3000}
      onChange={(index) => {
        if (itemsScrollContainerRef.current) {
          const item = itemsScrollContainerRef.current.children[index];

          if (item) {
            scrollIntoViewIfNeeded(
              itemsScrollContainerRef.current,
              item as HTMLElement,
              {
                behavior: "smooth",
              }
            );
          }
        }
      }}
    >
      <SequenceItems asChild>
        <div
          ref={itemsScrollContainerRef}
          className="flex gap-2 overflow-y-auto py-2"
        >
          {CONTENT.map((item, index) => (
            <SequenceItem
              key={index}
              className={cn(
                "border-muted relative shrink-0 cursor-pointer overflow-hidden rounded-lg border px-4 py-1 text-sm",
                "flex items-center gap-1.5 whitespace-nowrap",
                "hover:bg-muted/30 transition-colors",
                'before:bg-muted before:absolute before:inset-0 before:-z-10 before:content-[""]',
                "before:origin-left before:scale-x-(--progress)"
              )}
            >
              <item.icon size={16} className="-ml-1 shrink-0" />
              {item.title}
            </SequenceItem>
          ))}
        </div>
      </SequenceItems>
      <SequencePanels className="relative h-64 w-full">
        {CONTENT.map((item, index) => (
          <SequencePanel key={index}>
            <div className="border-border absolute top-0 left-0 flex h-full min-h-64 flex-col justify-between rounded-lg border p-4">
              <div className="text-muted-foreground font-mono text-sm uppercase">
                {item.title}
              </div>
              <div className="pr-8 text-xl font-medium text-pretty">
                {item.description}
              </div>
            </div>
          </SequencePanel>
        ))}
      </SequencePanels>
    </Sequence>
  );
};

export default SequenceScrollIntoView;
