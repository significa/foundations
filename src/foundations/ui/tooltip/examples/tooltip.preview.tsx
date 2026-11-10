import { Tooltip } from "#/foundations/ui/tooltip/tooltip.tsx";

export default function TooltipPreview() {
  return (
    <Tooltip>
      <Tooltip.Trigger>Nothing to see here</Tooltip.Trigger>
      <Tooltip.Content>Or is there?</Tooltip.Content>
    </Tooltip>
  );
}
