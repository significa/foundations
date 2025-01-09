"use client";

import { Fragment } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type MenuItem = {
  title: string;
  children: {
    title: string;
    href: string;
  }[];
};

export const Menu = ({ items }: { items: MenuItem[] }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-0.5">
      {items.map((item) => (
        <Fragment key={item.title}>
          <h3 className="text-sm font-medium not-first-of-type:mt-4 text-secondary-foreground py-2 px-3">
            {item.title}
          </h3>
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "rounded-lg hover:bg-foreground/5 py-2 px-3",
                pathname === child.href && "bg-foreground/5"
              )}
            >
              {child.title}
            </Link>
          ))}
        </Fragment>
      ))}
    </div>
  );
};
