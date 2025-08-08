"use client";

import { Button } from "@/foundations/ui/button/button";
import {
  Drawer,
  DrawerActions,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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
        <DrawerDescription>Drawer content goes here.</DrawerDescription>
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
