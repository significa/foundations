import { Button } from "#/foundations/ui/button/button.tsx";
import { Popover } from "#/foundations/ui/popover/popover.tsx";

export default function PopoverPointerPreview() {
  return (
    <Popover origin="pointer">
      <Popover.Trigger asChild>
        <Button variant="outline">Click anywhere on me</Button>
      </Popover.Trigger>
      <Popover.Content className="w-min whitespace-nowrap">
        <p>Here I am</p>
      </Popover.Content>
    </Popover>
  );
}
