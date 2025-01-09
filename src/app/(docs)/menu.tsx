"use client";

import { Fragment } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/foundations/ui/badge/badge";

export type MenuItem = {
  title: string;
  children: {
    title: string;
    href: string;
    tag?: string;
  }[];
};

export const Menu = ({ items }: { items: MenuItem[] }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-0.5">
      {items.map((item) => (
        <Fragment key={item.title}>
          <h3 className="text-sm font-medium not-first-of-type:mt-4 text-foreground-secondary pb-1 px-3">
            {item.title}
          </h3>
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "rounded-lg hover:bg-foreground/5 py-2 px-3 text-sm flex items-center gap-1 leading-none",
                pathname === child.href && "bg-foreground/5"
              )}
            >
              <span>{child.title}</span>
              {child.tag && (
                <Badge
                  size="xs"
                  variant={child.tag === "new" ? "success" : "info"}
                >
                  {child.tag.toUpperCase()}
                </Badge>
              )}
            </Link>
          ))}
        </Fragment>
      ))}
    </div>
  );
};
