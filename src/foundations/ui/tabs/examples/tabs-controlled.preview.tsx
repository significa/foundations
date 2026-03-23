'use client';

import { useState } from 'react';

import { Tabs } from '@/foundations/ui/tabs/tabs';

export default function TabsControlledPreview() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-foreground-secondary text-sm">Current tab:</span>
        <span className="font-medium">{selectedIndex}</span>
        <button
          type="button"
          onClick={() => setSelectedIndex((prev) => (prev + 1) % 3)}
          className="rounded-lg border px-3 py-1 text-sm"
        >
          Next tab
        </button>
      </div>

      <Tabs selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tabs.Items>
          <Tabs.Item>Tab 1</Tabs.Item>
          <Tabs.Item>Tab 2</Tabs.Item>
          <Tabs.Item>Tab 3</Tabs.Item>
        </Tabs.Items>
        <Tabs.Panels>
          <Tabs.Panel>Panel 1</Tabs.Panel>
          <Tabs.Panel>Panel 2</Tabs.Panel>
          <Tabs.Panel>Panel 3</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </div>
  );
}
