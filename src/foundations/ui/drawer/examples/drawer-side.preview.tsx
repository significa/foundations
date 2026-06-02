import { useState } from 'react';

import { Button } from '@/foundations/ui/button/button';
import { Drawer } from '@/foundations/ui/drawer/drawer';

const SIDES = [
  'left',
  'right',
  'bottom',
  'left-bottom',
  'right-bottom',
] as const;

const DrawerSide = () => {
  const [side, setSide] = useState<(typeof SIDES)[number]>('right-bottom');
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {SIDES.map((value) => (
        <Button
          key={value}
          variant="outline"
          onClick={() => {
            setSide(value);
            setOpen(true);
          }}
        >
          {value}
        </Button>
      ))}

      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Content side={side}>
          <Drawer.Header>
            <Drawer.Title>side=&quot;{side}&quot;</Drawer.Title>
          </Drawer.Header>
          <Drawer.Description>
            Hyphenated values pick a desktop edge and fall back to a bottom
            sheet on mobile — resize the viewport to see the switch.
          </Drawer.Description>
          <Drawer.Actions>
            <Drawer.Close asChild>
              <Button className="grow">Close</Button>
            </Drawer.Close>
          </Drawer.Actions>
        </Drawer.Content>
      </Drawer>
    </div>
  );
};

export default DrawerSide;
