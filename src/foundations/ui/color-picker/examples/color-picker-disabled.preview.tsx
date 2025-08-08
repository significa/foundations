"use client";
import { ColorPicker, HSVA } from "@/foundations/ui/color-picker/color-picker";

export default function ColorPickerDisabled() {
  const color: HSVA = [120, 0.7, 0.8, 1];

  return (
    <ColorPicker color={color} disabled>
      <ColorPicker.Area className="size-48" />
      <ColorPicker.Hue className="mt-2 w-48" />
    </ColorPicker>
  );
}
