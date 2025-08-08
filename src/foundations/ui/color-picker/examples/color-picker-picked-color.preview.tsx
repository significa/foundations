"use client";

import { useState } from "react";

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerHue,
  type HSVA,
} from "@/foundations/ui/color-picker/color-picker";

export default function ColorPickerWithInitialColor() {
  const [color, setColor] = useState<HSVA>([210, 0.8, 0.9, 1]);

  return (
    <ColorPicker className="w-48" color={color} onColorChange={setColor}>
      <ColorPickerArea />
      <ColorPickerHue className="mt-2" />
    </ColorPicker>
  );
}
