import { useState } from "react";
import { NumberInput } from "@/foundations/ui/number-input/number-input";

export default function NumberInputExample() {
  const [value, setValue] = useState(0);

  return (
    <div className="w-48">
      <NumberInput value={value} onValueChange={setValue} />
    </div>
  );
}
