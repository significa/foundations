import { Parallax } from '@/foundations/components/Parallax';

export function ParallaxExample() {
  return (
    <div className="relative w-full pb-[80vh]">
      <div className="absolute top-0 left-0 w-full p-12 text-center text-sm opacity-60">
        Scroll ↓
      </div>
      <div className="h-screen flex items-center justify-center whitespace-pre font-medium text-2xl text-foreground">
        {'Parallax me up, Scotty'.split('').map((str, i, arr) => (
          <Parallax key={i} speed={0.8 + 0.25 * Math.pow((i + 1) / arr.length, 3)}>
            {str}
          </Parallax>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full p-12 text-center text-sm opacity-60">
        Scroll ↑
      </div>
    </div>
  );
}
