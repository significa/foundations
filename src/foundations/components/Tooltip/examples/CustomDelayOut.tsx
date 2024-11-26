import { Tooltip } from '@/foundations/components/Tooltip';

export function CustomDelayOut() {
  return (
    <Tooltip content="Hello world" delayOut={1000}>
      <p>Hover me</p>
    </Tooltip>
  );
}
