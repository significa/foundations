import { Button } from '@/foundations/ui/button/button';
import { Popover } from '@/foundations/ui/popover/popover';

export default function PopoverModalPreview() {
  return (
    <Popover modal>
      <Popover.Trigger asChild>
        <Button variant="outline">Open Modal Popover</Button>
      </Popover.Trigger>
      <Popover.Content className="flex flex-col gap-4">
        <div>
          <h3 className="mb-1 font-medium text-sm">This is a modal popover</h3>
          <p className="text-foreground-secondary text-sm">
            It will trap focus inside. Very useful for popovers with advanced
            interactions inside (like forms)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover.Close asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Popover.Close>
          <Button type="submit">Submit</Button>
        </div>
      </Popover.Content>
    </Popover>
  );
}
