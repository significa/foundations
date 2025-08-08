"use client";

import { useState } from "react";
import {
  Tabs,
  TabsItem,
  TabsItems,
  TabsPanel,
  TabsPanels,
} from "@/foundations/ui/tabs/tabs";

export default function TabsControlledPreview() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-foreground-secondary text-sm">Current tab:</span>
        <span className="font-medium">{selectedIndex}</span>
        <button
          onClick={() => setSelectedIndex((prev) => (prev + 1) % 3)}
          className="rounded-lg border px-3 py-1 text-sm"
        >
          Next tab
        </button>
      </div>

      <Tabs selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <TabsItems>
          <TabsItem>Tab 1</TabsItem>
          <TabsItem>Tab 2</TabsItem>
          <TabsItem>Tab 3</TabsItem>
        </TabsItems>
        <TabsPanels>
          <TabsPanel>Panel 1</TabsPanel>
          <TabsPanel>Panel 2</TabsPanel>
          <TabsPanel>Panel 3</TabsPanel>
        </TabsPanels>
      </Tabs>
    </div>
  );
}
