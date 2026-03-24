import { Button } from '@/foundations/ui/button/button';
import { Drawer } from '@/foundations/ui/drawer/drawer';

const DrawerTallContent = () => {
  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button>Open Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Drawer Title</Drawer.Title>
        </Drawer.Header>
        {Array(24)
          .fill(null)
          .map((_, index) => (
            <p key={index} className="mb-4">
              This is paragraph {index + 1}.
            </p>
          ))}
        <Drawer.Actions className="flex gap-2">
          <Drawer.Close asChild>
            <Button className="grow">Submit</Button>
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

export default DrawerTallContent;
