import { useState } from "react";
import { Field } from "@/foundations/ui/field/field";
import { NumberInput } from "@/foundations/ui/number-input/number-input";

export default function NumberInputFormExample() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="w-64">
      <Field>
        <Field.Label>Quantity</Field.Label>
        <NumberInput value={quantity} onValueChange={setQuantity} min={1} max={99}>
          <NumberInput.Decrement />
          <Field.Control>
            <NumberInput.Field />
          </Field.Control>
          <NumberInput.Increment />
        </NumberInput>
        <Field.Description>Between 1 and 99. Use ↑/↓ to step, Shift for ×10.</Field.Description>
      </Field>
    </div>
  );
}
