import { Input } from "#/foundations/ui/input/input.tsx";

export default function InputDisabled() {
  return (
    <div className="w-90">
      <Input placeholder="Type something..." disabled />
    </div>
  );
}
