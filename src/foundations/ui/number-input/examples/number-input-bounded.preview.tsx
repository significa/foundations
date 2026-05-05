import { useState } from 'react';
import { NumberInput } from '@/foundations/ui/number-input/number-input';

export default function NumberInputBoundedExample() {
  const [value, setValue] = useState(50);

  return (
    <div className="flex w-56 flex-col gap-2">
      <NumberInput
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
        step={5}
      />
      <p className="text-foreground-secondary text-xs">
        0–100, step 5. Steppers disable at the bounds.
      </p>
    </div>
  );
}
