"use client";

import { Button } from "@/foundations/ui/button/button";
import { useState } from "react";
import {
  Sequence,
  SequenceItem,
  SequenceItems,
  SequencePanel,
  SequencePanels,
} from "../sequence";
import { eras as CONTENT } from "./content";

const SequencePreview = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <Sequence
      className="relative w-160"
      loop
      onChange={(index) => setSelectedIndex(index)}
      duration={3000}
    >
      <SequenceItems className="flex gap-2 overflow-y-auto py-2">
        {CONTENT.map((item, index) => (
          <SequenceItem key={index} asChild>
            <Button
              size="sm"
              variant={selectedIndex === index ? "primary" : "outline"}
            >
              <item.icon size={16} className="-ml-1 shrink-0" />
              {item.title}
            </Button>
          </SequenceItem>
        ))}
      </SequenceItems>
      <SequencePanels className="relative h-64 w-full">
        {CONTENT.map((item, index) => (
          <SequencePanel key={index}>
            <div className="border-border absolute top-0 left-0 flex h-full min-h-64 flex-col justify-between rounded-lg border p-4">
              <div className="text-foreground-secondary font-mono text-sm uppercase">
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

export default SequencePreview;
