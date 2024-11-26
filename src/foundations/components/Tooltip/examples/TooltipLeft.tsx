import { Tooltip } from '@/foundations/components/Tooltip';

export function TooltipLeft() {
  return (
    <Tooltip content="Hello world" placement="left">
      <p>Hover me</p>
    </Tooltip>
  );
}
