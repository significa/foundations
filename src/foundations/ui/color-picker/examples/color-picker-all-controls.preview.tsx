"use client";
import { ColorPicker, HSVA } from "@/foundations/ui/color-picker/color-picker";
import { useState } from "react";
import chroma from "chroma-js";

export default function ColorPickerAllControls() {
  const [color, setColor] = useState<HSVA>([280, 0.6, 0.9, 0.8]);

  return (
    <ColorPicker
      className="flex w-40 flex-col gap-2"
      color={color}
      onColorChange={setColor}
    >
      <ColorPicker.Area className="size-40" />
      <ColorPicker.Hue />
      <ColorPicker.Saturation />
      <ColorPicker.Lightness />
      <ColorPicker.Alpha />
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
