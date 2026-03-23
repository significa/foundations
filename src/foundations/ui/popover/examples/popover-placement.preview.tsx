import { Button } from '@/foundations/ui/button/button';
import { Popover } from '@/foundations/ui/popover/popover';

export default function PopoverPlacementPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Popover placement="top">
        <Popover.Trigger asChild>
          <Button variant="outline">Top</Button>
        </Popover.Trigger>
        <Popover.Content>
          <p>This popover appears on top.</p>
        </Popover.Content>
      </Popover>

      <Popover placement="bottom">
        <Popover.Trigger asChild>
          <Button variant="outline">Bottom</Button>
        </Popover.Trigger>
        <Popover.Content>
          <p>This popover appears at the bottom.</p>
        </Popover.Content>
      </Popover>

      <Popover placement="left">
        <Popover.Trigger asChild>
          <Button variant="outline">Left</Button>
        </Popover.Trigger>
        <Popover.Content>
          <p>This popover appears on the left.</p>
        </Popover.Content>
      </Popover>

      <Popover placement="right">
        <Popover.Trigger asChild>
          <Button variant="outline">Right</Button>
        </Popover.Trigger>
        <Popover.Content>
          <p>This popover appears on the right.</p>
        </Popover.Content>
      </Popover>
    </div>
  );
}
