import { Button } from "#/foundations/ui/button/button.tsx";
import { Popover } from "#/foundations/ui/popover/popover.tsx";

export default function PopoverPreview() {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline">Open Popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <p>This is the content of the popover.</p>
      </Popover.Content>
    </Popover>
  );
}
