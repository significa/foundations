import { Button } from '@/foundations/ui/button/button';
import { Drawer } from '@/foundations/ui/drawer/drawer';

const NestedDrawer = ({ depth }: { depth: number }) => {
  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button variant="outline">Open Drawer {depth}</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Drawer {depth}</Drawer.Title>
        </Drawer.Header>
        <Drawer.Description>
          Each drawer recedes behind the next, only the topmost backdrop dims
          the page, and Escape closes one level at a time.
        </Drawer.Description>

        <NestedDrawer depth={depth + 1} />

        <Drawer.Actions>
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

const DrawerStacked = () => {
  return <NestedDrawer depth={1} />;
};

export default DrawerStacked;
