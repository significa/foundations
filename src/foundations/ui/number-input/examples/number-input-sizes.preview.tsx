import { useState } from "react";
import { NumberInput } from "@/foundations/ui/number-input/number-input";

const sizes = ["xs", "sm", "md", "lg"] as const;

export default function NumberInputSizesExample() {
  const [value, setValue] = useState(0);

  return (
    <div className="flex w-56 flex-col gap-3">
      {sizes.map((size) => (
        <NumberInput
          key={size}
          size={size}
          value={value}
          onValueChange={setValue}
          min={0}
          max={100}
        />
      ))}
    </div>
  );
}
