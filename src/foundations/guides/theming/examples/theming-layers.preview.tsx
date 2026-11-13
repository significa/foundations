import {
  HouseIcon,
  ListIcon,
  MagnifyingGlassIcon,
  SquaresFourIcon,
  TrayIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Badge } from "#/foundations/ui/badge/badge.tsx";
import { Button } from "#/foundations/ui/button/button.tsx";
import { Checkbox } from "#/foundations/ui/checkbox/checkbox.tsx";
import { Input } from "#/foundations/ui/input/input.tsx";
import { SegmentedControl } from "#/foundations/ui/segmented-control/segmented-control.tsx";
import type { PreviewMeta } from "#/lib/preview.ts";

const navItems = [
  { label: "Home", icon: HouseIcon, current: true },
  { label: "Inbox", icon: TrayIcon, current: false },
];

const orders = [
  { reference: "PO-0441", status: "In transit", variant: "warning" },
  { reference: "PO-0442", status: "Delivered", variant: "success" },
  { reference: "PO-0443", status: "Delayed", variant: "error" },
] as const;

export default function ThemingLayersPreview() {
  return (
    <div className="flex min-h-120 bg-background-secondary text-sm text-foreground">
      <nav aria-label="Main" className="flex w-44 shrink-0 flex-col gap-1 p-3">
        {navItems.map(({ label, icon: Icon, current }) => (
          <a
            key={label}
            href="#theming"
            aria-current={current ? "page" : undefined}
            className="flex h-8 items-center gap-2 rounded-lg px-2 font-medium text-foreground-secondary aria-[current=page]:bg-control aria-[current=page]:text-foreground aria-[current=page]:shadow-control"
          >
            <Icon className="size-4" />
            {label}
          </a>
        ))}
      </nav>
      <main className="m-2 ml-0 flex flex-1 flex-col gap-4 rounded-xl border border-border bg-background p-5">
        <header className="flex items-center gap-3">
          <h2 className="text-base font-semibold">Orders</h2>
          <Badge size="sm">12 open</Badge>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button size="sm">New order</Button>
          </div>
        </header>
        <div className="flex items-center gap-3">
          <Input.Group size="sm" className="max-w-60">
            <Input.Addon>
              <MagnifyingGlassIcon />
            </Input.Addon>
            <Input placeholder="Search orders" />
          </Input.Group>
          <SegmentedControl defaultValue="list" className="ml-auto">
            <SegmentedControl.Item value="list">
              <ListIcon />
              <span>List</span>
            </SegmentedControl.Item>
            <SegmentedControl.Item value="board">
              <SquaresFourIcon />
              <span>Board</span>
            </SegmentedControl.Item>
          </SegmentedControl>
        </div>
        <section className="rounded-xl border border-border bg-surface shadow-surface">
          {orders.map(({ reference, status, variant }) => (
            <div
              key={reference}
              className="flex h-12 items-center gap-3 border-b border-border-subtle px-4 last:border-0"
            >
              <Checkbox aria-label={`Select ${reference}`} />
              <span className="font-mono text-foreground-secondary">{reference}</span>
              <Badge variant={variant} size="sm" className="ml-auto">
                {status}
              </Badge>
            </div>
          ))}
        </section>
        <div className="flex items-center gap-3 rounded-xl bg-[oklch(25%_0.06_270)] p-3 text-foreground scheme-dark">
          <span>2 selected</span>
          <Button variant="outline" size="sm" className="ml-auto">
            Compare
          </Button>
          <Input size="sm" placeholder="Note" className="w-32" />
        </div>
      </main>
    </div>
  );
}

export const meta = {
  layout: "fullscreen",
  mode: "iframe",
} satisfies PreviewMeta;
