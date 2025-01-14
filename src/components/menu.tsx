"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/foundations/ui/badge/badge";
import { navigation } from "@/lib/navigation";
import {
  Disclosure,
  DisclosureChevron,
  DisclosureContent,
  DisclosureTrigger,
} from "@/foundations/ui/disclosure/disclosure";

export const Menu = ({ items }: { items: typeof navigation }) => {
  const pathname = usePathname();

  return (
    <>
      {items.map((item, i) => (
        <Disclosure
          className="mb-4"
          key={item.title}
          defaultOpen={
            i === 0 || item.children.some((item) => item.href === pathname)
          }
        >
          <DisclosureTrigger className="text-foreground-secondary flex w-full cursor-pointer items-center justify-between px-3 pb-1 text-sm font-medium">
            <h3>{item.title}</h3>
            <DisclosureChevron />
          </DisclosureTrigger>
          <DisclosureContent className="flex flex-col gap-0.5">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "hover:bg-background-secondary flex items-center gap-1 rounded-lg px-3 py-2 text-sm leading-none",
                  pathname === child.href && "bg-background-secondary"
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
          </DisclosureContent>
        </Disclosure>
      ))}
    </>
  );
};
