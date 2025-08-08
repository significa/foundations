"use client";

import { useState } from "react";

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerHue,
  type HSVA,
} from "@/foundations/ui/color-picker/color-picker";

export default function ColorPickerExample() {
  const [color, setColor] = useState<HSVA>([0, 1, 1, 1]);

  return (
    <ColorPicker className="w-48" color={color} onColorChange={setColor}>
      <ColorPickerArea />
      <ColorPickerHue className="mt-2" />
    </ColorPicker>
  );
}
