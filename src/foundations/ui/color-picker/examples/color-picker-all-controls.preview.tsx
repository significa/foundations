"use client";

import chroma from "chroma-js";
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
      <div
        className="border-border h-16 w-full rounded-lg border"
        style={{
          backgroundColor: chroma
            .hsv(color[0], color[1], color[2])
            .alpha(color[3])
            .css(),
        }}
      />
    </ColorPicker>
  );
}
