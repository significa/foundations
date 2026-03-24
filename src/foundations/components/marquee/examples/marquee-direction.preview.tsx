import { Egg } from '@/components/icons/egg';
import { Marquee } from '@/foundations/components/marquee/marquee';

const MarqueeDirectionExample = () => {
  return (
    <div className="grid grid-cols-2 gap-8 whitespace-pre">
      {['left', 'up', 'right', 'down'].map((direction) => (
        <div key={direction}>
          <div className="mb-2 font-medium capitalize">{direction}</div>
          <Marquee
            direction={direction as 'left' | 'right' | 'up' | 'down'}
            className="h-[2.5em] w-48 items-center gap-2 rounded border border-border px-2 text-foreground-secondary"
          >
            Foundations
            <Egg />
          </Marquee>
        </div>
      ))}
    </div>
  );
};

export default MarqueeDirectionExample;
