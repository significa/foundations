import {
  AlignBottomIcon,
  AlignCenterVerticalIcon,
  AlignTopIcon,
} from '@phosphor-icons/react/dist/ssr';

import { ToggleGroup } from '@/foundations/ui/toggle/toggle';

export default function ToggleGroupVerticalPreview() {
  return (
    <ToggleGroup
      type="single"
      defaultValue="top"
      orientation="vertical"
      aria-label="Vertical alignment"
    >
      <ToggleGroup.Item value="top" square aria-label="Align top">
        <AlignTopIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="middle" square aria-label="Align middle">
        <AlignCenterVerticalIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="bottom" square aria-label="Align bottom">
        <AlignBottomIcon />
      </ToggleGroup.Item>
    </ToggleGroup>
  );
}
