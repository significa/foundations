"use client";

import { Slider } from "../slider";

export default function SliderPreview() {
  return (
    <div className="h-90 w-90 flex items-center justify-center">
      <Slider min={0} max={100} defaultValue={50} />
    </div>
  );
}
