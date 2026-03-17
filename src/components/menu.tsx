import { differenceInDays } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/foundations/ui/badge/badge";
import { Disclosure, DisclosureChevron, DisclosureContent, DisclosureTrigger } from "@/foundations/ui/disclosure/disclosure";
import { cn } from "@/lib/utils/classnames";
import type { NavigationItem } from "@/lib/utils/content";

type MenuProps = {
  currentPath?: string;
  items: NavigationItem[];
};

export const Menu = ({ items, currentPath: initialPath }: MenuProps) => {
  const [currentPath, setCurrentPath] = useState<string>(initialPath || "");

  useEffect(() => {
    const onPageLoad = () => {
      setCurrentPath(window.location.pathname);
    };

    document.addEventListener("astro:page-load", onPageLoad);

    return () => {
      document.removeEventListener("astro:page-load", onPageLoad);
    };
  }, []);

  return (
    <>
      {items.map((item) => (
        <Disclosure key={item.title} defaultOpen className="mb-4">
          <DisclosureTrigger
            className={cn(
              "bg-background text-foreground-secondary sticky top-0 flex w-full cursor-pointer items-center justify-between px-3 py-2 text-sm font-medium capitalize",
              "before:bg-background before:absolute before:bottom-full before:left-0 before:h-4 before:w-full"
            )}
          >
            <h3>{item.title}</h3>
            <DisclosureChevron />
          </DisclosureTrigger>
          <DisclosureContent className="flex flex-col gap-0.5">
            {item.children.map((child) => (
              <MenuItem key={child.href} item={child} isActive={child.href === currentPath} />
            ))}
          </DisclosureContent>
        </Disclosure>
      ))}
    </>
  );
};

type MenuItemProps = {
  item: NavigationItem["children"][number];
  isActive?: boolean;
};

const MenuItem = ({ item, isActive }: MenuItemProps) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tag, setTag] = useState<"new" | "updated" | undefined>(undefined);

  useEffect(() => {
    const createdAt = ref.current?.dataset.createdAt;
    const updatedAt = ref.current?.dataset.updatedAt;

    const isNew = createdAt && differenceInDays(new Date(), new Date(createdAt)) < 30;
    if (isNew) return setTag("new");

    const isUpdated = updatedAt && differenceInDays(new Date(), new Date(updatedAt)) < 15;
    if (isUpdated) return setTag("updated");
  }, []);

  return (
    <a
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
    </a>
  );
};
