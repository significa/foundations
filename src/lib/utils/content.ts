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

export { getPageCreateTime, getPageLastModifiedTime };
