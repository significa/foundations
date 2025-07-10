import { CreditCardIcon, GearIcon, UsersIcon } from "@phosphor-icons/react/dist/ssr";
import { Tabs, TabsItem, TabsItems, TabsPanel, TabsPanels } from "../tabs";

export default function TabsPreview() {
  return (
    <Tabs>
      <TabsItems>
        <TabsItem>
          <UsersIcon />
          <span>Users</span>
        </TabsItem>
        <TabsItem>
          <CreditCardIcon />
          <span>Billing</span>
        </TabsItem>
        <TabsItem>
          <GearIcon />
          <span>Settings</span>
        </TabsItem>
      </TabsItems>
      <TabsPanels>
        <TabsPanel>Panel 1</TabsPanel>
        <TabsPanel>Panel 2</TabsPanel>
        <TabsPanel>Panel 3</TabsPanel>
      </TabsPanels>
    </Tabs>
  );
}
