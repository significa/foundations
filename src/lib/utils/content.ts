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

  // Most recent change across the page itself and any source files it documents
  const [latest] = timestamps
    .filter(Boolean)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return latest ?? null;
};

export { getPageCreateTime, getPageLastModifiedTime };
