import {
  CreditCardIcon,
  GearIcon,
  UsersIcon,
} from '@phosphor-icons/react/dist/ssr';

import { Tabs } from '@/foundations/ui/tabs/tabs';

export default function TabsPreview() {
  return (
    <Tabs>
      <Tabs.Items>
        <Tabs.Item>
          <UsersIcon />
          <span>Users</span>
        </Tabs.Item>
        <Tabs.Item>
          <CreditCardIcon />
          <span>Billing</span>
        </Tabs.Item>
        <Tabs.Item>
          <GearIcon />
          <span>Settings</span>
        </Tabs.Item>
      </Tabs.Items>
      <Tabs.Panels>
        <Tabs.Panel>Panel 1</Tabs.Panel>
        <Tabs.Panel>Panel 2</Tabs.Panel>
        <Tabs.Panel>Panel 3</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}
