import type { CollectionEntry } from 'astro:content';
import { getPageCreateTime, getPageLastModifiedTime } from './content';

type NavigationItem = {
  title: string;
  children: {
    id: string;
    title: string;
    href: string;
    createdAt?: Date;
    updatedAt?: Date;
    order?: number;
  }[];
};

const FOLDER_SORT_ORDER: Record<string, number> = {
  introduction: 0,
  ui: 1,
  components: 2,
  hooks: 3,
  utils: 4,
};

const getNavigationItems = async (
  collection: CollectionEntry<'pages'>[]
): Promise<NavigationItem[]> => {
  const items: NavigationItem[] = [];

  for (const entry of collection) {
    const { title, folder = 'Pages', meta = {} } = entry.data;

    const existingGroup = items.find((item) => item.title === folder);

    const createdAt = await getPageCreateTime(entry);
    const updatedAt = await getPageLastModifiedTime(entry);

    const item = {
      id: entry.id,
      title,
      href: `/${entry.id}`,
      createdAt: createdAt ? new Date(createdAt) : undefined,
      updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      order: meta.order,
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

  for (const item of items) {
    item.children.sort((a, b) => {
      const orderA = a.order ?? 0;
      const orderB = b.order ?? 0;

      return orderA - orderB;
    });
  }

  return items.sort((a, b) => {
    const orderA =
      FOLDER_SORT_ORDER[a.title.toLowerCase()] ?? Number.POSITIVE_INFINITY;
    const orderB =
      FOLDER_SORT_ORDER[b.title.toLowerCase()] ?? Number.POSITIVE_INFINITY;

    return orderA - orderB;
  });
};

export type { NavigationItem };
export { getNavigationItems, getPageLastModifiedTime };
