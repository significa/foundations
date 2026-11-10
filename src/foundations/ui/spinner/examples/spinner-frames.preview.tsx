import { Spinner } from "./spinner-frames.tsx";

const sets = [
  { name: "braille", frames: undefined },
  { name: "moon", frames: ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"] },
  { name: "pipe", frames: ["|", "/", "-", "\\"] },
];

export default function SpinnerFramesExample() {
  return (
    <div className="flex items-center gap-12">
      {sets.map(({ name, frames }) => (
        <div key={name} className="flex flex-col items-center gap-4">
          <Spinner size="lg" frames={frames} />
          <span className="text-xs text-foreground-secondary">{name}</span>
        </div>
      ))}
    </div>
  );
}
