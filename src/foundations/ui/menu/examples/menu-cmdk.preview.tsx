import {
  ArchiveIcon,
  BookOpenIcon,
  CopyIcon,
  EnvelopeIcon,
  GearIcon,
  HouseIcon,
  PencilSimpleIcon,
} from '@phosphor-icons/react/dist/ssr';
import { useMemo, useState } from 'react';
import { Button } from '@/foundations/ui/button/button';
import { Dialog } from '@/foundations/ui/dialog/dialog';
import { Menu } from '@/foundations/ui/menu/menu';

const ACTIONS: {
  group: string;
  items: { id: string; label: string; icon: React.ReactNode }[];
}[] = [
  {
    group: 'Actions',
    items: [
      { id: 'edit', label: 'Edit', icon: <PencilSimpleIcon /> },
      { id: 'duplicate', label: 'Duplicate', icon: <CopyIcon /> },
      { id: 'archive', label: 'Archive', icon: <ArchiveIcon /> },
    ],
  },
  {
    group: 'Navigation',
    items: [
      { id: 'home', label: 'Go home', icon: <HouseIcon /> },
      { id: 'settings', label: 'Open settings', icon: <GearIcon /> },
    ],
  },
  {
    group: 'Help',
    items: [
      { id: 'docs', label: 'Documentation', icon: <BookOpenIcon /> },
      { id: 'support', label: 'Contact support', icon: <EnvelopeIcon /> },
    ],
  },
];

export default function MenuCmdkPreview() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ACTIONS;
    return ACTIONS.map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(q)),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery('');
      }}
    >
      <Dialog.Trigger asChild>
        <Button variant="outline">Open command menu</Button>
      </Dialog.Trigger>
      <Dialog.Content
        catchFocus={false}
        className="flex h-100 max-h-[70svh] w-full max-w-[calc(100vw-(--spacing(8)))] flex-col rounded-xl p-0 md:max-w-xl"
      >
        <Menu open={open} onOpenChange={setOpen} modal={false}>
          <Menu.Trigger className="hidden" />
          <Menu.Items inline className="flex h-full flex-col overflow-hidden">
            <Menu.SearchInput
              autoFocus
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex-1 scroll-py-(--inset) overflow-y-auto py-(--inset)">
              {filtered.map((group) => (
                <Menu.Section key={group.group}>
                  <Menu.Heading>{group.group}</Menu.Heading>
                  {group.items.map((item) => (
                    <Menu.Item key={item.id} onSelect={close}>
                      {item.icon}
                      {item.label}
                    </Menu.Item>
                  ))}
                </Menu.Section>
              ))}
              {filtered.length === 0 && (
                <Menu.Empty>No matching commands</Menu.Empty>
              )}
            </div>
          </Menu.Items>
        </Menu>
      </Dialog.Content>
    </Dialog>
  );
}
