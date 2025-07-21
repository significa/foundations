import path from "path";
import { getFoundationsPagePath } from "../constants";
import {
  getDirectoryFiles,
  getMostRecentCreatedDate,
  getMostRecentModifiedDate,
} from "../fs";
import { navigation } from "../navigation";

export const getNavigationWithDates = async () => {
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
};
