"use client";

import { Slider } from "../slider";

export default function SliderPreview() {
  return (
    <Slider min={0} max={100} defaultValue={50} orientation="vertical" />
  );
}
