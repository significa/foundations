import {
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@phosphor-icons/react/dist/ssr";

import { ToggleGroup } from "@/foundations/ui/toggle/toggle";

export default function ToggleGroupPreview() {
  return (
    <ToggleGroup type="single" defaultValue="left">
      <ToggleGroup.Item value="left" square aria-label="Align left">
        <TextAlignLeftIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="center" square aria-label="Align center">
        <TextAlignCenterIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="right" square aria-label="Align right">
        <TextAlignRightIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="justify" square aria-label="Justify">
        <TextAlignJustifyIcon />
      </ToggleGroup.Item>
    </ToggleGroup>
  );
}
