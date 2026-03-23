import { Button } from '@/foundations/ui/button/button';
import { Popover } from '@/foundations/ui/popover/popover';

export default function PopoverCustomWidthPreview() {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline">Custom Width</Button>
      </Popover.Trigger>
      <Popover.Content className="w-96">
        <p>This popover has a custom width of 24rem (w-96).</p>
        <p className="mt-2 text-foreground-secondary text-sm">
          You can customize the width of the popover by adding a width utility
          class to the Popover.Content component.
        </p>
      </Popover.Content>
    </Popover>
  );
}
