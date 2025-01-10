import { promises as fs } from "fs";
import { cache } from "react";

export const readFile = cache(async (filePath: string) => {
  return await fs.readFile(filePath, "utf-8");
});

export const getCreatedDate = cache(async (filePath: string) => {
  const stats = await fs.stat(filePath);
  return stats.birthtime;
});

export const getLastModifiedDate = cache(async (filePath: string) => {
  const stats = await fs.stat(filePath);
  return stats.mtime;
});
