import { Sequence } from '@/foundations/components/Sequence';

const ITEMS = [
  { label: 'Chicken', value: 'uno', content: '🐓' },
  { label: 'Egg', value: 'dos', content: '🥚' },
  { label: 'Breakfast', value: 'tres', content: '🍳' }
];

export function SequenceExample() {
  return (
    <Sequence.Root
      className="w-full max-w-[500px] p-12 flex flex-col gap-4"
      values={ITEMS.map(({ value }) => value)}
      stepDuration={3000}
    >
      <div className="flex justify-center gap-4">
        {ITEMS.map(({ label, value }, index) => (
          <Sequence.Trigger
            value={value}
            key={index}
            className="relative w-full py-3 text-left data-[state=inactive]:opacity-40 transition-opacity"
          >
            <div>{label}</div>
            <div
              className="absolute left-0 bottom-0 w-full h-[1px] bg-foreground origin-left"
              style={{ transform: 'scaleX(var(--progress, 0))' }}
            />
            <div className="absolute left-0 bottom-0 w-full h-[1px] bg-foreground/10 origin-left" />
          </Sequence.Trigger>
        ))}
      </div>
      <div className="relative w-full h-0 pb-[50%]">
        {ITEMS.map(({ content, value }, index) => (
          <Sequence.Content
            value={value}
            key={index}
            className="absolute inset-0 flex items-center justify-center bg-foreground/5 border border-foreground/10 rounded-lg"
          >
            <span className="text-8xl">{content}</span>
          </Sequence.Content>
        ))}
      </div>
    </Sequence.Root>
  );
}
