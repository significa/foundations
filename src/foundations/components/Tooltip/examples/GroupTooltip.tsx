import { Tooltip, TooltipGroup } from '@/foundations/components/Tooltip';
import { Button } from '../../Button';

export function GroupTooltip() {
  return (
    <TooltipGroup>
      <div className="flex gap-2">
        {['One', 'Two', 'Three'].map((item) => (
          <Tooltip key={item} content={`Content ${item}`}>
            <Button>{item}</Button>
          </Tooltip>
        ))}
      </div>
    </TooltipGroup>
  );
}
