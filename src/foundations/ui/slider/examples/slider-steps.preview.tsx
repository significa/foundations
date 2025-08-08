import {
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/foundations/ui/slider/slider";

export default function SliderPreview() {
  return (
    <Slider min={0} max={100} defaultValue={50} step={10}>
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  );
}
