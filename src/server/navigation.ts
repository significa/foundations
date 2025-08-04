import path from "node:path";

import { createServerFn } from "@tanstack/react-start";

import { navigation } from "@/lib/navigation";
import { getFoundationsPagePath } from "@/lib/constants";

import { getDirectoryFiles, getMostRecentCreatedDate, getMostRecentModifiedDate } from "./fs";

export const getNavigationWithDates = createServerFn({
  type: "static",
}).handler(async () => {
  return await Promise.all(
    navigation.map(async (item) => ({
      ...item,
      children: await Promise.all(
        item.children
          .sort((a, b) => a.title.localeCompare(b.title))
          .map(async (child) => {
            const filePath = path.join(
              process.cwd(),
              getFoundationsPagePath(child.href.split("/"))
            );
            const createdAt = await getMostRecentCreatedDate(
              await getDirectoryFiles(path.dirname(filePath))
            );

            const updatedAt = await getMostRecentModifiedDate(
              await getDirectoryFiles(path.dirname(filePath))
            );

            return {
              ...child,
              createdAt,
              updatedAt,
            };
          })
      ),
    }))
  );
});