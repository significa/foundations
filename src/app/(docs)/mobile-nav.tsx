"use client";

import { Menu } from "@/components/menu";
import { Button } from "@/foundations/ui/button/button";
import { Portal } from "@/foundations/ui/portal/portal";
import { navigation } from "@/lib/navigation";
import { List, X } from "@phosphor-icons/react";
import { useState } from "react";

export const MobileNav = ({ items }: { items: typeof navigation }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="xl:hidden"
        variant="ghost"
        size="sm"
        square
        aria-label="Open menu"
        onClick={() => setIsOpen(true)}
      >
        <List />
      </Button>
      {isOpen && (
        <Portal>
          <div className="bg-background fixed inset-0 z-50">
            <div className="flex h-12 w-full items-center border-b px-2 md:h-14 md:px-4">
              <Button
                variant="ghost"
                size="sm"
                square
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
              >
                <X />
              </Button>
            </div>
            <div className="h-[calc(100dvh-var(--spacing)*14)] overflow-y-auto overscroll-contain pt-6">
              <Menu items={items} />
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};
