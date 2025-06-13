"use client";

import {
  Drawer,
  DrawerMain,
  DrawerTitle,
  DrawerHeader,
  DrawerContent,
  DrawerTrigger,
  DrawerActions,
  DrawerClose,
} from "../drawer";
import { Button } from "@/foundations/ui/button/button";
import { Checkbox } from "@/foundations/ui/checkbox/checkbox";
import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

interface PersistItemProps {
  onSubmit: () => void;
  item: { title: string };
  persistExitAnimation: boolean;
}

const PersistItem = ({
  onSubmit,
  item,
  persistExitAnimation,
}: PersistItemProps) => {
  return (
    <li className="bg-background-highlight border-border rounded-xl border p-3">
      <h2 className="text-md mb-4 font-medium">{item.title}</h2>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash /> Remove
          </Button>
        </DrawerTrigger>
        <DrawerContent persistExitAnimation={persistExitAnimation}>
          <DrawerHeader>
            <DrawerTitle>Remove Item</DrawerTitle>
          </DrawerHeader>
          <DrawerMain>
            <p>Are you sure you want to remove this item?</p>
          </DrawerMain>
          <DrawerActions className="flex gap-2">
            <DrawerClose asChild>
              <Button variant="destructive" className="grow" onClick={onSubmit}>
                Remove
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button className="grow">Close</Button>
            </DrawerClose>
          </DrawerActions>
        </DrawerContent>
      </Drawer>
    </li>
  );
};

const DrawerPersistAnimation = () => {
  const [persistExitAnimation, setPersistExitAnimation] = useState(true);
  const [items, setItems] = useState([
    { title: crypto.randomUUID().slice(0, 8) },
  ]);

  return (
    <div>
      <div className="mb-8 space-y-2">
        <div className="text-foreground-secondary my-4 max-w-128 space-y-2 text-sm">
          <p>
            The{" "}
            <code className="text-foreground mx-1">persistExitAnimation</code>{" "}
            prop forces (an HTML clone of) DrawerContent to stay in the DOM
            until its exit animation completes.
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <label className="text-foreground flex items-center gap-2 text-sm">
            <Checkbox
              checked={persistExitAnimation}
              onChange={(e) => setPersistExitAnimation(e.target.checked)}
            />
            Persist?
          </label>
          <Button
            size="xs"
            variant="ghost"
            onClick={() =>
              setItems((prev) => [
                ...prev,
                { title: crypto.randomUUID().slice(0, 8) },
              ])
            }
          >
            <Plus /> Add Item
          </Button>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-2">
        {items.map((item) => (
          <PersistItem
            key={item.title}
            item={item}
            persistExitAnimation={persistExitAnimation}
            onSubmit={() => {
              setItems((prev) => prev.filter((i) => i.title !== item.title));
            }}
          />
        ))}
      </ul>
    </div>
  );
};

export default DrawerPersistAnimation;
