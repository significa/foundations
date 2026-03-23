'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { Sequence } from '@/foundations/components/sequence/sequence';
import { cn } from '@/lib/utils/classnames';

import { eras as CONTENT } from './content';

const SequenceMotion = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <Sequence
      loop
      className="w-160"
      onChange={(index) => setSelectedIndex(index)}
      duration={3000}
    >
      <Sequence.Items className="flex w-full gap-2">
        {CONTENT.map((item, index) => (
          <Sequence.Item
            key={index}
            className={cn(
              'relative shrink-0 cursor-pointer overflow-hidden rounded-lg border border-background-secondary px-4 py-1 text-sm',
              'flex items-center gap-1.5 whitespace-nowrap',
              'transition-colors hover:bg-background-secondary/30',
              'before:absolute before:inset-0 before:-z-10 before:bg-background-secondary before:content-[""]',
              'before:origin-left before:scale-x-(--progress)'
            )}
          >
            <item.icon size={16} className="-ml-1 shrink-0" />
            {item.title}
          </Sequence.Item>
        ))}
      </Sequence.Items>

      <Sequence.Panels className="mt-4 grid overflow-hidden">
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
                <Sequence.Panel forceMount>
                  <div className="flex h-full min-h-64 flex-col justify-between rounded-lg border border-border p-4">
                    <motion.div
                      className="font-mono text-foreground-secondary text-sm uppercase"
                      initial={{ opacity: 0, y: '50%' }}
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
                      className="text-pretty pr-8 font-medium text-xl"
                      initial={{ opacity: 0, y: '50%' }}
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
                </Sequence.Panel>
              </motion.div>
            ) : (
              <Sequence.Panel key={`${index}placeholder`} />
            )
          )}
        </AnimatePresence>
      </Sequence.Panels>
    </Sequence>
  );
};

export default SequenceMotion;
