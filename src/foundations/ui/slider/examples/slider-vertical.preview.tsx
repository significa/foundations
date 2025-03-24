"use client"

import { Slider } from "../slider";

export default function SliderPreview() {
  return (
    <div className="w-90 h-90">
      <Slider
        min={0}
        max={100}
        value={50}
        orientation="vertical"
      />
    </div>
  );
}