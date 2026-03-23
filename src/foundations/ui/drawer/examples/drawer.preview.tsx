'use client';

import { Button } from '@/foundations/ui/button/button';
import { Drawer } from '@/foundations/ui/drawer/drawer';

const DrawerPreview = () => {
  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button>Open Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Drawer Title</Drawer.Title>
        </Drawer.Header>
        <Drawer.Description>Drawer content goes here.</Drawer.Description>
        <Drawer.Actions className="flex gap-2">
          <Drawer.Close asChild>
            <Button variant="primary" className="grow">
              Submit
            </Button>
          </Drawer.Close>
          <Drawer.Close asChild>
            <Button className="grow" variant="outline">
              Close
            </Button>
          </Drawer.Close>
        </Drawer.Actions>
      </Drawer.Content>
    </Drawer>
  );
};

export default DrawerPreview;
