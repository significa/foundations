import { Tooltip, TooltipGroup } from '@/foundations/components/Tooltip';
import { Button } from '../../Button';

export function GroupDelayPriority() {
  return (
    <TooltipGroup delayIn={0}>
      <div className="flex gap-2">
        {['One', 'Two', 'Three'].map((item) => (
          <Tooltip key={item} content={`Content ${item}`} delayIn={1000}>
            <Button>{item}</Button>
          </Tooltip>
        ))}
      </div>
    </TooltipGroup>
  );
}
