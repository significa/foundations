import type { ReactNode } from 'react';
import { Tabs } from '@/foundations/ui/tabs/tabs';

interface Props {
  autoSlot: ReactNode;
  switcherSlot: ReactNode;
}

const SetupCssTabs = ({ autoSlot, switcherSlot }: Props) => {
  return (
    <Tabs className="mt-6">
      <Tabs.Items className="pb-0">
        <Tabs.Item>Automatic color scheme</Tabs.Item>
        <Tabs.Item>With theme switcher</Tabs.Item>
      </Tabs.Items>
      <Tabs.Panels>
        <Tabs.Panel>{autoSlot}</Tabs.Panel>
        <Tabs.Panel>{switcherSlot}</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
};

export { SetupCssTabs };
