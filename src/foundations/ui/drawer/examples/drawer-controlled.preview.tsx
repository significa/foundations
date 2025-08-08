"use client";

import { useState } from "react";

import { Button } from "@/foundations/ui/button/button";
import {
  Drawer,
  DrawerActions,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/foundations/ui/drawer/drawer";

const DrawerControlled = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(isOpen) => setOpen(isSubmitting ? true : isOpen)}
    >
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <DrawerContent inert={isSubmitting}>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
        </DrawerHeader>
        <p>Drawer dangerous content goes here.</p>
        <DrawerActions className="flex gap-2">
          <Button
            className="grow"
            variant="destructive"
            isLoading={isSubmitting}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Delete Everything
          </Button>
          <Button
            className="grow"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            I&apos;m not sure
          </Button>
        </DrawerActions>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerControlled;
