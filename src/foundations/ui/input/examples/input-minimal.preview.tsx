import { Input } from "#/foundations/ui/input/input.tsx";

export default function InputMinimal() {
  return (
    <div className="w-90">
      <Input variant="minimal" placeholder="Type something..." />
    </div>
  );
}
