"use client";
import { ColorPicker, HSVA } from "@/foundations/ui/color-picker/color-picker";
import { useState } from "react";

export default function ColorPickerWithInitialColor() {
  const [color, setColor] = useState<HSVA>([210, 0.8, 0.9, 1]);

  return (
    <ColorPicker className="w-48" color={color} onColorChange={setColor}>
      <ColorPicker.Area />
      <ColorPicker.Hue className="mt-2" />
    </ColorPicker>
  );
}
