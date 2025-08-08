import { Slider } from "@/foundations/ui/slider/slider";

export default function SliderPreview() {
  return <Slider min={0} max={100} defaultValue={50} step={10} />;
}
