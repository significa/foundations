import {
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/foundations/ui/slider/slider";

export default function SliderPreview() {
  return (
    <Slider min={0} max={100} defaultValue={50} orientation="vertical">
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  );
}
