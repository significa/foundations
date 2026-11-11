import {
  BellIcon,
  CaretLeftIcon,
  CaretRightIcon,
  PaletteIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { Button } from "#/foundations/ui/button/button.tsx";
import { Popover } from "#/foundations/ui/popover/popover.tsx";
import { Switch } from "#/foundations/ui/switch/switch.tsx";

type View = "root" | "notifications" | "appearance";

const TITLES = { notifications: "Notifications", appearance: "Appearance" };

const SETTINGS = {
  notifications: ["Email", "Push", "Weekly digest"],
  appearance: ["Reduce motion", "Compact mode"],
};

export default function PopoverViewsPreview() {
  const [view, setView] = useState<View>("root");

  return (
    // Reset on open, not on close, so the closing animation doesn't show the root view.
    <Popover onOpenChange={(open) => open && setView("root")}>
      <Popover.Trigger asChild>
        <Button variant="outline">Settings</Button>
      </Popover.Trigger>
      <Popover.Content className="p-0">
        {/* The focused button unmounts on a view change: autoFocus puts focus in the new view. */}
        {view === "root" ? (
          <div className="flex flex-col p-1">
            <Button
              autoFocus
              variant="ghost"
              className="justify-start"
              onClick={() => setView("notifications")}
            >
              <BellIcon />
              Notifications
              <CaretRightIcon className="ml-auto" />
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => setView("appearance")}>
              <PaletteIcon />
              Appearance
              <CaretRightIcon className="ml-auto" />
            </Button>
          </div>
        ) : (
          <>
            <Popover.Header className="pl-2">
              <Button
                autoFocus
                variant="ghost"
                size="xs"
                square
                aria-label="Back"
                onClick={() => setView("root")}
              >
                <CaretLeftIcon />
              </Button>
              <span>{TITLES[view]}</span>
            </Popover.Header>
            <div className="flex flex-col gap-3 p-4">
              {SETTINGS[view].map((label) => (
                <label key={label} className="flex items-center justify-between text-sm">
                  {label}
                  <Switch />
                </label>
              ))}
            </div>
          </>
        )}
      </Popover.Content>
    </Popover>
  );
}
