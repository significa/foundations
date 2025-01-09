import { getCreatedDate, getLastModifiedDate } from "@/lib/fs";
import { Menu } from "./menu";
import path from "path";
import { differenceInDays } from "date-fns";

export const menu: React.ComponentProps<typeof Menu>["items"] = [
  {
    title: "Introduction",
    children: [
      {
        title: "Setup",
        href: "/setup",
      },
    ],
  },
  {
    title: "UI",
    children: [
      {
        title: "Button",
        href: "/ui/button",
      },
      {
        title: "Spinner",
        href: "/ui/spinner",
      },
    ],
  },
];

export const Sidebar = async () => {
  const enhancedMenu = await Promise.all(
    menu.map(async (item) => ({
      ...item,
      children: await Promise.all(
        item.children.map(async (child) => {
          // TODO: this path.join needs to be centralized
          const lastUpdated = await getLastModifiedDate(
            path.join(
              process.cwd(),
              "src",
              "foundations",
              child.href,
              "page.mdx"
            )
          );
          const created = await getCreatedDate(
            path.join(
              process.cwd(),
              "src",
              "foundations",
              child.href,
              "page.mdx"
            )
          );

          const isNew = differenceInDays(new Date(), created) < 30;
          const isUpdated = differenceInDays(new Date(), lastUpdated) < 30;

          return {
            ...child,
            tag: isNew ? "new" : isUpdated ? "updated" : undefined,
          };
        })
      ),
    }))
  );

  return (
    <aside className="overflow-y-auto h-[calc(100dvh-var(--spacing)*14)] sticky top-14 border-r md:px-2 px-1 w-[250px] shrink-0 pt-6">
      <Menu items={enhancedMenu} />
    </aside>
  );
};
