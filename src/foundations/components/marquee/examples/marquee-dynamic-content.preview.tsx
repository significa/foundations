"use client";

import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { Marquee } from "@/foundations/components/marquee/marquee";
import { Button } from "@/foundations/ui/button/button";

const MarqueeDynamicContentExample = () => {
  const [items, setItems] = useState(["0"]);

  const addItem = () => {
    setItems((prevItems) => [...prevItems, `${prevItems.length}`]);
  };

  const removeItem = () => {
    if (items.length > 1) {
      setItems(items.slice(0, -1));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={addItem} variant="outline" size="sm">
          <PlusIcon size={16} />
          Add
        </Button>
        <Button onClick={removeItem} variant="outline" size="sm">
          <MinusIcon size={16} />
          Remove
        </Button>
      </div>
      <Marquee className="border-border text-foreground-secondary h-[2.5em] w-96 items-center gap-2 rounded border px-2">
        {items}
      </Marquee>
    </div>
  );
};

export default MarqueeDynamicContentExample;
