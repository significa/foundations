import { Button } from "@/foundations/ui/button/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerActions,
  DrawerMain,
} from "@/foundations/ui/drawer/drawer";

const DrawerTallContent = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
        </DrawerHeader>
        <DrawerMain>
          {Array(24)
            .fill(null)
            .map((_, index) => (
              <p key={index} className="mb-4">
                This is paragraph {index + 1}.
              </p>
            ))}
        </DrawerMain>
        <DrawerActions className="flex gap-2">
          <DrawerClose asChild>
            <Button className="grow">Submit</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button className="grow" variant="outline">
              Close
            </Button>
          </DrawerClose>
        </DrawerActions>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerTallContent;
