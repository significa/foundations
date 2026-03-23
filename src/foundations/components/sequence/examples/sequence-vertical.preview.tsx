'use client';

import { Sequence } from '@/foundations/components/sequence/sequence';
import { cn } from '@/lib/utils/classnames';

import { eras as CONTENT } from './content';

const SequenceVertical = () => {
  return (
    <Sequence
      orientation="vertical"
      loop
      className="flex max-w-lg gap-10"
      duration={3000}
    >
      <div className="flex gap-2">
        <div
          className={cn(
            'flex h-8 items-center transition-transform duration-300 ease-out',
            'translate-y-[calc(var(--index)*100%)]'
          )}
        >
          <div
            className={cn(
              'relative h-3 w-3 rounded-full text-foreground',
              'before:absolute before:inset-0 before:bg-foreground/10',
              "before:rounded-full before:content-['']"
            )}
            style={{
              '--fill': 'calc(var(--progress) * 100%)',
              background: `conic-gradient(from 0deg at 50% 50%, currentColor var(--fill), transparent var(--fill))`,
            }}
          />
        </div>
        <Sequence.Items>
          {CONTENT.map((item, index) => (
            <Sequence.Item
              key={index}
              value={index.toString()}
              className={cn(
                'block h-8 text-left font-medium text-base',
                'text-foreground-secondary data-[selected=true]:text-foreground',
                'cursor-pointer hover:text-foreground/60 active:text-foreground/80'
              )}
            >
              {item.title}
            </Sequence.Item>
          ))}
        </Sequence.Items>
      </div>
      <Sequence.Panels className="min-h-64">
        {CONTENT.map((item, index) => (
          <Sequence.Panel key={index} className="font-medium text-xl">
            {item.description}
          </Sequence.Panel>
        ))}
      </Sequence.Panels>
    </Sequence>
  );
};

export default SequenceVertical;
