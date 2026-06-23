import {
  BellIcon,
  ChartLineIcon,
  FolderIcon,
  GearIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  SidebarSimpleIcon,
  UsersIcon,
} from '@phosphor-icons/react/dist/ssr';
import { useState } from 'react';
import { Avatar } from '@/foundations/ui/avatar/avatar';
import { Button, IconButton } from '@/foundations/ui/button/button';
import { Divider } from '@/foundations/ui/divider/divider';
import { cn } from '@/lib/utils/classnames';

const NAV_ITEMS = [
  { id: 'home', label: 'Dashboard', icon: HouseIcon },
  { id: 'analytics', label: 'Analytics', icon: ChartLineIcon },
  { id: 'projects', label: 'Projects', icon: FolderIcon },
  { id: 'team', label: 'Team', icon: UsersIcon },
];

interface SidebarLayoutProps extends React.ComponentPropsWithRef<'div'> {
  /** Title shown in the top bar. */
  title?: string;
}

const SidebarLayout = ({
  title = 'Dashboard',
  className,
  ...props
}: SidebarLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('home');

  return (
    <div
      className={cn(
        'flex h-full w-full overflow-hidden bg-background text-foreground',
        className
      )}
      {...props}
    >
      <aside
        className={cn(
          'flex shrink-0 flex-col border-border border-r transition-[width] duration-300 ease-emphasized-decelerate',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        <div className="flex h-14 items-center gap-2 px-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
            <ChartLineIcon weight="bold" />
          </div>
          {!collapsed && <span className="font-semibold">Acme Inc.</span>}
        </div>

        <Divider />

        <nav className="flex flex-1 flex-col gap-1 p-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                data-active={item.id === active || undefined}
                className={cn(
                  'flex h-10 items-center gap-3 rounded-lg px-3 text-foreground-secondary text-sm transition',
                  'hover:bg-foreground/5 hover:text-foreground',
                  'data-active:bg-background-secondary data-active:text-foreground',
                  collapsed && 'justify-center px-0'
                )}
              >
                <Icon className="shrink-0 text-lg" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <Divider />

        <div
          className={cn(
            'flex items-center gap-2 p-3',
            collapsed && 'justify-center'
          )}
        >
          <Avatar size="sm">
            <Avatar.Image src="https://github.com/pdrbrnd.png" />
            <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-medium text-sm">Pedro Brandão</p>
              <p className="truncate text-foreground-secondary text-xs">
                pedro@acme.co
              </p>
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-border border-b px-4">
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Toggle sidebar"
            onClick={() => setCollapsed((value) => !value)}
          >
            <SidebarSimpleIcon />
          </IconButton>
          <h1 className="font-medium">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <IconButton size="sm" variant="ghost" aria-label="Search">
              <MagnifyingGlassIcon />
            </IconButton>
            <IconButton size="sm" variant="ghost" aria-label="Notifications">
              <BellIcon />
            </IconButton>
            <Button size="sm" variant="outline">
              <GearIcon />
              Settings
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {['Revenue', 'Active users', 'Conversion'].map((stat) => (
              <div key={stat} className="rounded-xl border border-border p-4">
                <p className="text-foreground-secondary text-sm">{stat}</p>
                <p className="mt-1 font-semibold text-2xl">
                  {stat === 'Revenue'
                    ? '$48.2k'
                    : stat === 'Active users'
                      ? '2,401'
                      : '3.6%'}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 h-48 rounded-xl border border-border border-dashed" />
        </main>
      </div>
    </div>
  );
};

export { SidebarLayout };
