"use client";

import { cn } from "@/lib/utils";
import {
  Sequence,
  SequenceItem,
  SequenceItems,
  SequencePanel,
  SequencePanels,
} from "@/foundations/components/sequence/sequence";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

import { eras as CONTENT } from "./content";

const SequenceMotion = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <Sequence
      loop
      className="w-160"
      onChange={(index) => setSelectedIndex(index)}
      duration={3000}
    >
      <SequenceItems className="flex w-full gap-2">
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

      <SequencePanels className="mt-4 grid overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {CONTENT.map((item, index) =>
            index === selectedIndex ? (
              <motion.div
                key={index}
                className="col-start-1 row-start-1"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ duration: 0.125 }}
              >
                <SequencePanel forceMount>
                  <div className="border-border flex h-full min-h-64 flex-col justify-between rounded-lg border p-4">
                    <motion.div
                      className="text-muted-foreground font-mono text-sm uppercase"
                      initial={{ opacity: 0, y: "50%" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1.5,
                        delay: 0.15,
                        ease: [0.19, 1.0, 0.22, 1.0],
                      }}
                    >
                      {item.title}
                    </motion.div>
                    <motion.div
                      className="pr-8 text-xl font-medium text-pretty"
                      initial={{ opacity: 0, y: "50%" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1.5,
                        delay: 0.15,
                        ease: [0.19, 1.0, 0.22, 1.0],
                      }}
                    >
                      {item.description}
                    </motion.div>
                  </div>
                </SequencePanel>
              </motion.div>
            ) : (
              <SequencePanel key={index + "placeholder"} />
            )
          )}
        </AnimatePresence>
      </SequencePanels>
    </Sequence>
  );
};

export default SequenceMotion;
