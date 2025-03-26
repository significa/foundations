"use client";

import { Slider } from "../slider";

export default function SliderPreview() {
  return (
    <div className="h-90 w-90">
      <Slider min={0} max={100} defaultValue={50} disabled />
    </div>
  );
}
