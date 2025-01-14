import path from "path";
import { differenceInDays } from "date-fns";
import { getFoundationsPagePath } from "./constants";
import {
  getDirectoryFiles,
  getMostRecentCreatedDate,
  getMostRecentModifiedDate,
} from "./fs";

type NavigationItem = {
  title: string;
  children: {
    title: string;
    href: string;
    tag?: string;
  }[];
};

export const navigation: NavigationItem[] = [
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

export const getNavigationWithTags = async () => {
  return await Promise.all(
    navigation.map(async (item) => ({
      ...item,
      children: await Promise.all(
        item.children.map(async (child) => {
          const filePath = path.join(
            process.cwd(),
            getFoundationsPagePath(child.href.split("/"))
          );
          const created = await getMostRecentCreatedDate(
            await getDirectoryFiles(path.dirname(filePath))
          );
          const isNew = differenceInDays(new Date(), created) < 30;

          const updated = await getMostRecentModifiedDate(
            await getDirectoryFiles(path.dirname(filePath))
          );
          const isUpdated = differenceInDays(new Date(), updated) < 15;

          return {
            ...child,
            tag: isNew ? "new" : isUpdated ? "updated" : undefined,
          };
        })
      ),
    }))
  );
};
