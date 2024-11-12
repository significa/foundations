import { Parallax } from '@/foundations/components/Parallax';

export function ParallaxSpeeds() {
  return (
    <div className="relative w-full py-[50vh]">
      <div className="absolute top-0 left-0 w-full p-12 text-center text-sm opacity-60">
        Scroll ↓
      </div>
      <div className="relative py-[150vh] flex gap-6 justify-center items-center">
        <div className="absolute w-full top-1/2 right-0 border-t border-foreground px-4 opacity-60">
          y center
        </div>
        {[
          [0.5, 'Slower'],
          [0.75, 'Slow'],
          [1, 'Regular'],
          [1.25, 'Fast'],
          [1.5, 'Faster']
        ].map(([speed, label], index) => (
          <Parallax
            key={index}
            speed={Number(speed)}
            className="size-20 bg-accent text-center text-sm flex flex-col items-center justify-center rounded-lg"
          >
            <div>{label}</div>
            <div>({speed})</div>
          </Parallax>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full p-12 text-center text-sm opacity-60">
        Scroll ↑
      </div>
    </div>
  );
}
