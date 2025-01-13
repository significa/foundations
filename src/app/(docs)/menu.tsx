"use client";

import { Fragment } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/foundations/ui/badge/badge";
import { navigation } from "@/lib/navigation";

export const Menu = ({ items }: { items: typeof navigation }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-0.5">
      {items.map((item) => (
        <Fragment key={item.title}>
          <h3 className="text-foreground-secondary px-3 pb-1 text-sm font-medium not-first-of-type:mt-4">
            {item.title}
          </h3>
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "hover:bg-foreground/5 flex items-center gap-1 rounded-lg px-3 py-2 text-sm leading-none",
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
