import path from "path";
import { differenceInDays } from "date-fns";

import { navigation } from "@/lib/navigation";
import { getCreatedDate, getLastModifiedDate } from "@/lib/fs";

import { Menu } from "./menu";
import { getFoundationsPagePath } from "@/lib/constants";

export const Sidebar = async () => {
  const enhancedMenu = await Promise.all(
    navigation.map(async (item) => ({
      ...item,
      children: await Promise.all(
        item.children.map(async (child) => {
          const filePath = path.join(
            process.cwd(),
            getFoundationsPagePath(child.href.split("/"))
          );

          const created = await getCreatedDate(filePath);
          const isNew = differenceInDays(new Date(), created) < 30;

          const updated = await getLastModifiedDate(filePath);
          const isUpdated = differenceInDays(new Date(), updated) < 30;

          return {
            ...child,
            tag: isNew ? "new" : isUpdated ? "updated" : undefined,
          };
        })
      ),
    }))
  );

  return (
    <aside className="overflow-y-auto h-[calc(100dvh-var(--spacing)*14)] sticky top-14 border-r md:px-2 px-1 w-[250px] shrink-0 pt-6 hidden xl:block">
      <Menu items={enhancedMenu} />
    </aside>
  );
};
