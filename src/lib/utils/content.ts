import type { CollectionEntry } from "astro:content";
import { getGitCreateTime, getGitLastCommitShortSha, getGitLastModifiedTime } from "./git.ts";

const getPageCreateTime = async (page: CollectionEntry<"pages">) => {
  const pageFile = page.filePath;
  if (!pageFile) return null;

  return getGitCreateTime(pageFile);
};

const getPageLastModifiedTime = async (
  page: CollectionEntry<"pages">,
  extraFiles: string[] = [],
) => {
  const pageFile = page.filePath;
  if (!pageFile) return null;

  const depFiles = page.data.files || [];
  const files = [pageFile, ...depFiles, ...extraFiles];

  const timestamps = await Promise.all(files.map((filePath) => getGitLastModifiedTime(filePath)));

  // Most recent change across the page itself and any source files it documents
  const [latest] = timestamps
    .filter(Boolean)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return latest ?? null;
};

/** Short sha + ISO date of the last change to the page or the source files it documents. */
const getPageVersion = async (page: CollectionEntry<"pages">, extraFiles: string[] = []) => {
  const pageFile = page.filePath;
  if (!pageFile) return { sha: null, date: null };

  const files = [pageFile, ...(page.data.files || []), ...extraFiles];

  const [sha, date] = await Promise.all([
    getGitLastCommitShortSha(files),
    getPageLastModifiedTime(page, extraFiles).catch(() => null),
  ]);

  return { sha, date };
};

export { getPageCreateTime, getPageLastModifiedTime, getPageVersion };
