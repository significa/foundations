"use client";

import { useState } from "react";

import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerHue,
  ColorPickerLightness,
  ColorPickerSaturation,
  type HSVA,
} from "@/foundations/ui/color-picker/color-picker";

export default function ColorPickerAllControls() {
  const [color, setColor] = useState<HSVA>([280, 0.6, 0.9, 0.8]);

  return (
    <ColorPicker
      className="flex w-40 flex-col gap-2"
      color={color}
      onColorChange={setColor}
    >
      <ColorPickerArea className="size-40" />
      <ColorPickerHue />
      <ColorPickerSaturation />
      <ColorPickerLightness />
      <ColorPickerAlpha />
    </ColorPicker>
  );
}
