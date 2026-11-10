import { CreditCardIcon, GearIcon, UsersIcon } from "@phosphor-icons/react/dist/ssr";

import { Tabs } from "#/foundations/ui/tabs/tabs.tsx";

export default function TabsPreview() {
  return (
    <Tabs>
      <Tabs.Items>
        <Tabs.Item value="users">
          <UsersIcon />
          <span>Users</span>
        </Tabs.Item>
        <Tabs.Item value="billing">
          <CreditCardIcon />
          <span>Billing</span>
        </Tabs.Item>
        <Tabs.Item value="settings">
          <GearIcon />
          <span>Settings</span>
        </Tabs.Item>
      </Tabs.Items>
      <Tabs.Panels>
        <Tabs.Panel value="users">Users panel</Tabs.Panel>
        <Tabs.Panel value="billing">Billing panel</Tabs.Panel>
        <Tabs.Panel value="settings">Settings panel</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}
