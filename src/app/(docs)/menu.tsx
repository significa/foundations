"use client";

import { Fragment } from "react";
import Link from "next/link";

import { isSectionMenuItem, MenuItem } from "./types";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const Menu = ({ items }: { items: MenuItem[] }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-0.5">
      {items.map((item) =>
        isSectionMenuItem(item) ? (
          <Fragment key={item.title}>
            <h3 className="text-sm font-medium not-first-of-type:mt-4 text-secondary-foreground py-1.5 px-2">
              {item.title}
            </h3>
            <Menu items={item.children} />
          </Fragment>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg hover:bg-foreground/5 py-1.5 px-2 text-sm",
              pathname === item.href && "bg-foreground/5"
            )}
          >
            {item.title}
          </Link>
        )
      )}
    </div>
  );
};
