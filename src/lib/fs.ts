import { promises as fs } from "fs";
import { cache } from "react";

export const readFile = cache(async (filePath: string) => {
  return await fs.readFile(filePath, "utf-8");
});

export const getDirectoryFiles = cache(async (dirPath: string) => {
  const files = await fs.readdir(dirPath);

  return files.map((file) => `${dirPath}/${file}`);
});

export const getCreatedDate = cache(async (filePath: string) => {
  const stats = await fs.stat(filePath);
  return stats.birthtime;
});

export const getLastModifiedDate = cache(async (filePath: string) => {
  const stats = await fs.stat(filePath);
  return stats.mtime;
});

export const getMostRecentCreatedDate = cache(async (files: string[]) => {
  const dates = await Promise.all(files.map(getCreatedDate));

  return new Date(Math.max(...dates.map((date) => date.getTime())));
});

export const getMostRecentModifiedDate = cache(async (files: string[]) => {
  const dates = await Promise.all(files.map(getLastModifiedDate));

  return new Date(Math.max(...dates.map((date) => date.getTime())));
});
