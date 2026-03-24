import { useState } from 'react';

import { cn } from '@/lib/utils/classnames';

import { Sequence } from '../sequence';
import { eras as CONTENT } from './content';

const SequencePauseHover = () => {
  const [paused, setPaused] = useState(false);

  return (
    <Sequence className="relative w-160" loop paused={paused} duration={3000}>
      <Sequence.Items
        className="flex gap-2 overflow-y-auto py-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
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
      <Sequence.Panels className="relative h-64 w-full">
        {CONTENT.map((item, index) => (
          <Sequence.Panel key={index}>
            <div className="absolute top-0 left-0 flex h-full min-h-64 flex-col justify-between rounded-lg border border-border p-4">
              <div className="font-mono text-foreground-secondary text-sm uppercase">
                {item.title}
              </div>
              <div className="text-pretty pr-8 font-medium text-xl">
                {item.description}
              </div>
            </div>
          </Sequence.Panel>
        ))}
      </Sequence.Panels>
    </Sequence>
  );
};

export default SequencePauseHover;
