"use client";

import { Button } from "@/foundations/ui/button/button";
import {
  Drawer,
  DrawerActions,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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
        {Array(24)
          .fill(null)
          .map((_, index) => (
            <p key={index} className="mb-4">
              This is paragraph {index + 1}.
            </p>
          ))}
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
