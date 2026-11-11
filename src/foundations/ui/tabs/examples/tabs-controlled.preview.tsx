import { useState } from "react";

import { Tabs } from "#/foundations/ui/tabs/tabs.tsx";

const TABS = ["account", "billing", "security"];

export default function TabsControlledPreview() {
  const [tab, setTab] = useState("account");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground-secondary">Current tab:</span>
        <span className="font-medium">{tab}</span>
        <button
          type="button"
          onClick={() => setTab((prev) => TABS[(TABS.indexOf(prev) + 1) % TABS.length] ?? prev)}
          className="rounded-lg border px-3 py-1 text-sm"
        >
          Next tab
        </button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <Tabs.Items>
          <Tabs.Item value="account">Account</Tabs.Item>
          <Tabs.Item value="billing">Billing</Tabs.Item>
          <Tabs.Item value="security">Security</Tabs.Item>
        </Tabs.Items>
        <Tabs.Panels>
          <Tabs.Panel value="account">Account panel</Tabs.Panel>
          <Tabs.Panel value="billing">Billing panel</Tabs.Panel>
          <Tabs.Panel value="security">Security panel</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </div>
  );
}
