import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerHue,
  type HSVA,
} from "@/foundations/ui/color-picker/color-picker";

export default function ColorPickerDisabled() {
  const color: HSVA = [120, 0.7, 0.8, 1];

  return (
    <ColorPicker color={color} disabled>
      <ColorPickerArea className="size-48" />
      <ColorPickerHue className="mt-2 w-48" />
    </ColorPicker>
  );
}
