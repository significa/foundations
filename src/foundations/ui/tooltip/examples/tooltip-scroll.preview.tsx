import { Tooltip } from '@/foundations/ui/tooltip/tooltip';

export default function TooltipScrollPreview() {
  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="flex h-[200vh] items-center justify-center">
        <Tooltip open>
          <Tooltip.Trigger>
            Scroll to see the tooltip reposition itself
          </Tooltip.Trigger>
          <Tooltip.Content>Tooltip content</Tooltip.Content>
        </Tooltip>
      </div>
    </div>
  );
}
