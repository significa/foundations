import type { CollectionEntry } from 'astro:content';
import { getGitCreateTime, getGitLastModifiedTime } from './git';

const getPageCreateTime = async (page: CollectionEntry<'pages'>) => {
  const pageFile = page.filePath;
  if (!pageFile) return null;

  return getGitCreateTime(pageFile);
};

const getPageLastModifiedTime = async (page: CollectionEntry<'pages'>) => {
  const pageFile = page.filePath;
  if (!pageFile) return null;

  const depFiles = page.data.files || [];
  const files = [pageFile, ...depFiles];

  const timestamps = await Promise.all(
    files.map((filePath) => getGitLastModifiedTime(filePath))
  );

  const [earliest] = timestamps.sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return earliest;
};

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

const getNavigationItems = async (
  collection: CollectionEntry<'pages'>[]
): Promise<NavigationItem[]> => {
  const items: NavigationItem[] = [];

  for (const entry of collection) {
    const { title, folder = 'Pages' } = entry.data;

    const existingGroup = items.find((item) => item.title === folder);

    const createdAt = await getPageCreateTime(entry);
    const updatedAt = await getPageLastModifiedTime(entry);

    const item = {
      title,
      href: `/${entry.id}`,
      createdAt: createdAt ? new Date(createdAt) : undefined,
      updatedAt: updatedAt ? new Date(updatedAt) : undefined,
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
    const orderA =
      FOLDER_SORT_ORDER[a.title.toLowerCase()] ?? Number.POSITIVE_INFINITY;
    const orderB =
      FOLDER_SORT_ORDER[b.title.toLowerCase()] ?? Number.POSITIVE_INFINITY;

    return orderA - orderB;
  });
};

export type { NavigationItem };
export { getNavigationItems, getPageLastModifiedTime };
