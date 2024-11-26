import { Tooltip } from '@/foundations/components/Tooltip';

export function DisabledTooltip() {
  return (
    <Tooltip content="Hello world" disabled>
      <p>Hover me</p>
    </Tooltip>
  );
}
