import { InfoIcon } from '@phosphor-icons/react';
import { useRef } from 'react';

import { Input } from '@/foundations/ui/input/input';
import { Tooltip } from '@/foundations/ui/tooltip/tooltip';

export default function InputInteractiveAddon() {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="w-90">
      <Input.Group>
        <Input.Prefix className="pointer-events-auto" asChild>
          <button type="button" onClick={() => alert('interactive')}>
            +351
          </button>
        </Input.Prefix>
        <Input ref={input} placeholder="000 000 000" />
        <Input.Suffix className="pointer-events-auto">
          <Tooltip>
            <Tooltip.Trigger>
              <InfoIcon />
            </Tooltip.Trigger>
            <Tooltip.Content>Your phone number will be visible</Tooltip.Content>
          </Tooltip>
        </Input.Suffix>
      </Input.Group>
    </div>
  );
}
