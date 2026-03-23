import { Tooltip } from '@/foundations/ui/tooltip/tooltip';

export default function TooltipPreview() {
  return (
    <Tooltip>
      <Tooltip.Trigger>Nothing to see here</Tooltip.Trigger>
      <Tooltip.Content>Or is there?</Tooltip.Content>
    </Tooltip>
  );
}
