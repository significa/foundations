import {
  CreditCardIcon,
  GearIcon,
  UsersIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Tabs, TabsItem, TabsItems, TabsPanel, TabsPanels } from "../tabs";

export default function TabsVerticalPreview() {
  return (
    <Tabs orientation="vertical" className="flex gap-4">
      <TabsItems className="w-60">
        <TabsItem className="w-full justify-start">
          <UsersIcon />
          <span>Users</span>
        </TabsItem>
        <TabsItem className="w-full justify-start">
          <CreditCardIcon />
          <span>Billing</span>
        </TabsItem>
        <TabsItem className="w-full justify-start">
          <GearIcon />
          <span>Settings</span>
        </TabsItem>
      </TabsItems>
      <TabsPanels className="w-90">
        <TabsPanel>
          <h3 className="text-lg font-medium">Users Panel</h3>
          <p className="text-muted-foreground">Manage your users here.</p>
        </TabsPanel>
        <TabsPanel>
          <h3 className="text-lg font-medium">Billing Panel</h3>
          <p className="text-muted-foreground">
            Manage your billing information.
          </p>
        </TabsPanel>
        <TabsPanel>
          <h3 className="text-lg font-medium">Settings Panel</h3>
          <p className="text-muted-foreground">
            Configure your application settings.
          </p>
        </TabsPanel>
      </TabsPanels>
    </Tabs>
  );
}
