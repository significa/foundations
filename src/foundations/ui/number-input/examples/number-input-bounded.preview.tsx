import { useState } from "react";
import { NumberInput } from "#/foundations/ui/number-input/number-input.tsx";

export default function NumberInputBoundedExample() {
  const [value, setValue] = useState(50);

  return (
    <div className="flex w-56 flex-col gap-2">
      <NumberInput value={value} onValueChange={setValue} min={0} max={100} step={5}>
        <NumberInput.Decrement />
        <NumberInput.Field />
        <NumberInput.Increment />
      </NumberInput>
      <p className="text-xs text-foreground-secondary">
        0–100, step 5. Steppers disable at the bounds.
      </p>
    </div>
  );
}
