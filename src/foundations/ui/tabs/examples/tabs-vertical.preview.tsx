import { CreditCardIcon, GearIcon, UsersIcon } from "@phosphor-icons/react/dist/ssr";

import { Tabs } from "@/foundations/ui/tabs/tabs";

export default function TabsVerticalPreview() {
  return (
    <Tabs orientation="vertical" className="flex gap-4">
      <Tabs.Items className="w-60">
        <Tabs.Item className="w-full justify-start">
          <UsersIcon />
          <span>Users</span>
        </Tabs.Item>
        <Tabs.Item className="w-full justify-start">
          <CreditCardIcon />
          <span>Billing</span>
        </Tabs.Item>
        <Tabs.Item className="w-full justify-start">
          <GearIcon />
          <span>Settings</span>
        </Tabs.Item>
      </Tabs.Items>
      <Tabs.Panels className="w-90">
        <Tabs.Panel>
          <h3 className="text-lg font-medium">Users Panel</h3>
          <p className="text-foreground-secondary">Manage your users here.</p>
        </Tabs.Panel>
        <Tabs.Panel>
          <h3 className="text-lg font-medium">Billing Panel</h3>
          <p className="text-foreground-secondary">Manage your billing information.</p>
        </Tabs.Panel>
        <Tabs.Panel>
          <h3 className="text-lg font-medium">Settings Panel</h3>
          <p className="text-foreground-secondary">Configure your application settings.</p>
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}
