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

const DrawerPreview = () => {
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
          <p>Drawer content goes here.</p>
        </DrawerMain>
        <DrawerActions className="flex gap-2">
          <DrawerClose asChild>
            <Button variant="primary" className="grow">
              Submit
            </Button>
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

export default DrawerPreview;
