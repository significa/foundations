import { Parallax } from '@/foundations/components/Parallax';
import { cn } from '@/lib/tailwind';

function Column({ index }: { index: number }) {
  const isEven = index % 2 === 0;

  return (
    <div className={cn('flex flex-col gap-8', isEven ? '-mt-[20vh] opacity-20' : 'opacity-30')}>
      {new Array(isEven ? 13 : 12).fill(null).map((_, i) => (
        <div key={i} className="relative w-full h-0 pb-[100%]">
          <div className="absolute inset-0 bg-foreground rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function ParallaxColumnStagger() {
  return (
    <div className="w-full p-12 my-[33vh] grid grid-cols-5 gap-8">
      <Parallax speed={1.2}>
        <Column index={0} />
      </Parallax>
      <Parallax speed={0.7}>
        <Column index={1} />
      </Parallax>
      <Parallax speed={1.2}>
        <Column index={2} />
      </Parallax>
      <Parallax speed={0.7}>
        <Column index={3} />
      </Parallax>
      <Parallax speed={1.2}>
        <Column index={4} />
      </Parallax>
    </div>
  );
}
