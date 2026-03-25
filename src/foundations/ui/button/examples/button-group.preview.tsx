import {
  TextBIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react/dist/ssr';

import { Button, IconButton } from '@/foundations/ui/button/button';

export default function ButtonGroupPreview() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button.Group>
        <Button variant="outline">Day</Button>
        <Button variant="outline">Week</Button>
        <Button variant="outline">Month</Button>
      </Button.Group>
      <Button.Group>
        <IconButton variant="outline" aria-label="Bold">
          <TextBIcon />
        </IconButton>
        <IconButton variant="outline" aria-label="Italic">
          <TextItalicIcon />
        </IconButton>
        <IconButton variant="outline" aria-label="Underline">
          <TextUnderlineIcon />
        </IconButton>
        <IconButton variant="outline" aria-label="Strikethrough">
          <TextStrikethroughIcon />
        </IconButton>
      </Button.Group>
    </div>
  );
}
