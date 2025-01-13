"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/foundations/ui/badge/badge";
import { navigation } from "@/lib/navigation";
import {
  Accordion,
  AccordionChevron,
  AccordionContent,
  AccordionTrigger,
} from "@/foundations/ui/accordion/accordion";

export const SidebarClient = ({ items }: { items: typeof navigation }) => {
  const pathname = usePathname();

  return (
    <aside className="sticky top-14 hidden h-[calc(100dvh-var(--spacing)*14)] w-[250px] shrink-0 overflow-y-auto border-r px-1 pt-6 md:px-2 xl:block">
      {items.map((item) => (
        <Accordion className="mb-4" key={item.title} defaultOpen>
          <AccordionTrigger className="text-foreground-secondary flex w-full cursor-pointer items-center justify-between px-3 pb-1 text-sm font-medium">
            <h3>{item.title}</h3>
            <AccordionChevron />
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-0.5">
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
          </AccordionContent>
        </Accordion>
      ))}
    </aside>
  );
};
