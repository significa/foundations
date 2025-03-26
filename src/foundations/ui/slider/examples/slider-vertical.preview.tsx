"use client";

import { Slider } from "../slider";

export default function SliderPreview() {
  return (
    <div className="h-90 w-90 flex items-center justify-center border border-red-500">
      <Slider min={0} max={100} defaultValue={50} orientation="vertical" />
    </div>
  );
}
