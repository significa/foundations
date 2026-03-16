import type { CollectionEntry } from "astro:content";

type NavigationItem = {
  title: string;
  children: {
    title: string;
    href: string;
    createdAt?: Date;
    updatedAt?: Date;
  }[];
};

const getNavigationItems = (collection: CollectionEntry<"pages">[]): NavigationItem[] => {
  const items: NavigationItem[] = [];

  for (const entry of collection) {
    const { title, meta } = entry.data;
    const folder = meta?.folder || "Pages";

    const existingGroup = items.find((item) => item.title === folder);

    const item = {
      title,
      href: `/${entry.id}`,
    };

    if (existingGroup) {
      existingGroup.children.push(item);
    } else {
      items.push({
        title: folder,
        children: [item],
      });
    }
  }

  return items;
};

export { getNavigationItems };
export type { NavigationItem };
