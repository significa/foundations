import { Tooltip } from '@/foundations/components/Tooltip';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from '../../Button';

export function PersistOnClick() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <Tooltip
      persistOnClick
      delayIn={0}
      content={copied ? 'Copied!' : 'Copy'}
      onOpenChange={(open) => {
        if (!open) setCopied(false);
      }}
    >
      <Button onClick={() => setCopied(true)}>Copy</Button>
    </Tooltip>
  );
}
