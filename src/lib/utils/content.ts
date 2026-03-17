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

const FOLDER_SORT_ORDER: Record<string, number> = {
  introduction: 0,
  ui: 1,
  components: 2,
  hooks: 3,
  utils: 4,
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

  return items.sort((a, b) => {
    const orderA = FOLDER_SORT_ORDER[a.title.toLowerCase()] ?? Number.POSITIVE_INFINITY;
    const orderB = FOLDER_SORT_ORDER[b.title.toLowerCase()] ?? Number.POSITIVE_INFINITY;

    return orderA - orderB;
  });
};

export { getNavigationItems };
export type { NavigationItem };
