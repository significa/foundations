import type { ReactNode } from "react";
import { Tabs } from "#/foundations/ui/tabs/tabs.tsx";

interface Props {
  autoSlot: ReactNode;
  switcherSlot: ReactNode;
}

const SetupCssTabs = ({ autoSlot, switcherSlot }: Props) => {
  return (
    <Tabs defaultValue="auto" className="mt-6">
      <Tabs.Items className="pb-0">
        <Tabs.Item value="auto">Automatic color scheme</Tabs.Item>
        <Tabs.Item value="switcher">With theme switcher</Tabs.Item>
      </Tabs.Items>
      <Tabs.Panels>
        <Tabs.Panel value="auto">{autoSlot}</Tabs.Panel>
        <Tabs.Panel value="switcher">{switcherSlot}</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
};

export { SetupCssTabs };
