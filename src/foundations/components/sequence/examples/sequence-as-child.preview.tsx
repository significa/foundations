import { useState } from "react";
import { Sequence } from "#/foundations/components/sequence/sequence.tsx";
import { Button } from "#/foundations/ui/button/button.tsx";
import { eras as CONTENT } from "./content.ts";

const SequencePreview = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <Sequence
      className="relative w-160"
      loop
      onChange={(index) => setSelectedIndex(index)}
      duration={3000}
    >
      <Sequence.Items className="flex gap-2 overflow-y-auto py-2">
        {CONTENT.map((item, index) => (
          <Sequence.Item key={index} asChild>
            <Button size="sm" variant={selectedIndex === index ? "primary" : "outline"}>
              <item.icon size={16} className="-ml-1 shrink-0" />
              {item.title}
            </Button>
          </Sequence.Item>
        ))}
      </Sequence.Items>
      <Sequence.Panels className="relative h-64 w-full">
        {CONTENT.map((item, index) => (
          <Sequence.Panel key={index}>
            <div className="absolute top-0 left-0 flex h-full min-h-64 flex-col justify-between rounded-lg border border-border p-4">
              <div className="font-mono text-sm text-foreground-secondary uppercase">
                {item.title}
              </div>
              <div className="pr-8 text-xl font-medium text-pretty">{item.description}</div>
            </div>
          </Sequence.Panel>
        ))}
      </Sequence.Panels>
    </Sequence>
  );
};

export default SequencePreview;
