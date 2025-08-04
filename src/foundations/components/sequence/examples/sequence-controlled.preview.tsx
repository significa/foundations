"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/foundations/ui/button/button";
import {
  Sequence,
  SequenceItem,
  SequenceItems,
  SequencePanel,
  SequencePanels,
} from "../sequence";
import { eras as CONTENT } from "./content";

const SequenceControlled = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div>
      <div className="py-2">
        <Button
          size="sm"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % CONTENT.length)}
        >
          Next
        </Button>
      </div>
      <Sequence
        className="relative w-160"
        loop
        duration={3000}
        currentIndex={currentIndex}
        onChange={setCurrentIndex}
      >
        <SequenceItems className="flex gap-2 overflow-y-auto py-2">
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
    </div>
  );
};

export default SequenceControlled;
