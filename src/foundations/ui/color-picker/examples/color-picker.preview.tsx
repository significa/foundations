"use client";
import { ColorPicker, HSV } from "@/foundations/ui/color-picker/color-picker";
import { useState } from "react";
import chroma from "chroma-js";

export default function ColorPickerExample() {
  const [pickedColor, setPickerColor] = useState<HSV | undefined>(undefined);

  return (
    <div className="flex justify-between gap-4">
      <div className="w-36"></div>
      <ColorPicker
        color={pickedColor}
        onColorChange={setPickerColor}
      ></ColorPicker>
      <div className="flex w-36 flex-col gap-2 text-sm">
        {pickedColor && (
          <>
            <div
              className="mr-4 h-6 rounded-md"
              style={{
                backgroundColor: pickedColor
                  ? chroma.hsv(...pickedColor).css()
                  : "transparent",
              }}
            ></div>
            <div>
              <p className="font-bold">HEX</p>
              <p>{chroma.hsv(...pickedColor).hex()}</p>
            </div>
            <div>
              <p className="font-bold">RGB</p>
              <p>{chroma.hsv(...pickedColor).css()}</p>
            </div>
            <div>
              <p className="font-bold">HSV</p>
              <p>
                {pickedColor.map((v) => Math.round(v * 100) / 100).join(", ")}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
