import { Tooltip } from '@/foundations/components/Tooltip';
import { Button } from '../../Button';

export function DisabledTrigger() {
  return (
    <Tooltip content="Hello world">
      <Button disabled>Hover me</Button>
    </Tooltip>
  );
}
