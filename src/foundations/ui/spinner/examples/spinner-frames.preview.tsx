import { SPINNER_FRAMES, Spinner } from '@/foundations/ui/spinner/spinner';

const presets: Array<{
  name: keyof typeof SPINNER_FRAMES;
  interval?: number;
}> = [
  { name: 'braille' },
  { name: 'bounce', interval: 140 },
  { name: 'moon', interval: 120 },
  { name: 'sparkle', interval: 140 },
  { name: 'dots', interval: 120 },
  { name: 'shades', interval: 100 },
  { name: 'pipe' },
];

export default function SpinnerFramesPreview() {
  return (
    <div className="grid grid-cols-2 items-center gap-x-12 gap-y-8 sm:grid-cols-4">
      {presets.map(({ name, interval }) => (
        <div key={name} className="flex flex-col items-center gap-4">
          <div className="flex size-6 items-center justify-center">
            <Spinner
              variant="frames"
              frames={SPINNER_FRAMES[name]}
              interval={interval}
            />
          </div>
          <span className="text-center text-foreground-secondary text-xs">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}
