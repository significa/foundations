import { promises as fs } from "fs";

export async function getCreatedDate(filePath: string) {
  const stats = await fs.stat(filePath);
  return stats.birthtime;
}

export async function getLastModifiedDate(filePath: string) {
  const stats = await fs.stat(filePath);
  return stats.mtime;
}
