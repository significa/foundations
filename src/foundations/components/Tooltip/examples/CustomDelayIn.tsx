import { Tooltip } from '@/foundations/components/Tooltip';

export function CustomDelayIn() {
  return (
    <Tooltip content="Hello world" delayIn={1000}>
      <p>Hover me</p>
    </Tooltip>
  );
}
