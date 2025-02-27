"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigation } from "@/lib/navigation";
import {
  Disclosure,
  DisclosureChevron,
  DisclosureContent,
  DisclosureTrigger,
} from "@/foundations/ui/disclosure/disclosure";
import { useEffect, useMemo, useRef, useState } from "react";
import { differenceInDays } from "date-fns";
import { Badge } from "@/foundations/ui/badge/badge";

export const Menu = ({ items }: { items: typeof navigation }) => {
  return (
    <>
      {items.map((item) => (
        <Disclosure className="mb-4" key={item.title} defaultOpen>
          <DisclosureTrigger className="text-foreground-secondary flex w-full cursor-pointer items-center justify-between px-3 pb-1 text-sm font-medium">
            <h3>{item.title}</h3>
            <DisclosureChevron />
          </DisclosureTrigger>
          <DisclosureContent className="flex flex-col gap-0.5">
            {item.children.map((child, i) => (
              <MenuItem key={i} item={child} />
            ))}
          </DisclosureContent>
        </Disclosure>
      ))}
    </>
  );
};

const MenuItem = ({
  item,
}: {
  item: (typeof navigation)[number]["children"][number];
}) => {
  const pathname = usePathname();

  const isActive = useMemo(() => pathname === item.href, [pathname, item.href]);

  const ref = useRef<HTMLAnchorElement>(null);
  const [tag, setTag] = useState<"new" | "updated" | undefined>(undefined);

  useEffect(() => {
    const createdAt = ref.current?.dataset.createdAt;
    const updatedAt = ref.current?.dataset.updatedAt;

    const isNew =
      createdAt && differenceInDays(new Date(), new Date(createdAt)) < 30;

    if (isNew) return setTag("new");

    const isUpdated =
      updatedAt && differenceInDays(new Date(), new Date(updatedAt)) < 15;
    if (isUpdated) return setTag("updated");
  }, []);

  return (
    <Link
      ref={ref}
      data-created-at={item.createdAt}
      data-updated-at={item.updatedAt}
      href={item.href}
      className={cn(
        "hover:bg-background-secondary flex h-8 shrink-0 items-center gap-1 rounded-lg px-3 text-sm leading-none",
        isActive && "bg-background-secondary"
      )}
    >
      <span>{item.title}</span>
      {tag && (
        <Badge size="xs" variant={tag === "new" ? "success" : "info"}>
          {tag.toUpperCase()}
        </Badge>
      )}
    </Link>
  );
};
