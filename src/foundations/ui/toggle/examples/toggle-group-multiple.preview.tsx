import {
  TextBIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react/dist/ssr';

import { ToggleGroup } from '@/foundations/ui/toggle/toggle';

export default function ToggleGroupMultiplePreview() {
  return (
    <ToggleGroup
      type="multiple"
      defaultValue={['bold']}
      aria-label="Text formatting"
    >
      <ToggleGroup.Item value="bold" square aria-label="Bold">
        <TextBIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="italic" square aria-label="Italic">
        <TextItalicIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="underline" square aria-label="Underline">
        <TextUnderlineIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="strikethrough" square aria-label="Strikethrough">
        <TextStrikethroughIcon />
      </ToggleGroup.Item>
    </ToggleGroup>
  );
}
