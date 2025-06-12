import { CreditCard, Gear, Users } from "@phosphor-icons/react/dist/ssr";
import { Tabs, TabsItem, TabsItems, TabsPanel, TabsPanels } from "../tabs";

export default function TabsPreview() {
  return (
    <Tabs>
      <TabsItems>
        <TabsItem>
          <Users />
          <span>Users</span>
        </TabsItem>
        <TabsItem>
          <CreditCard />
          <span>Billing</span>
        </TabsItem>
        <TabsItem>
          <Gear />
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
