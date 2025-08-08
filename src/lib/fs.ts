import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";

export const readFile = cache(async (filePath: string) => {
  return await fs.readFile(filePath, "utf-8");
});

export async function* walkDirectory(dir: string): AsyncGenerator<string> {
  for await (const d of await fs.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walkDirectory(entry);
    else if (d.isFile()) yield entry;
  }
}

export const getDirectoryFiles = cache(async (dirPath: string) => {
  const files = await fs.readdir(dirPath);

  return files.map((file) => `${dirPath}/${file}`);
});

export const sanitizeFilepath = (filePath: string): string => {
  return filePath.replace(/"/g, '\\"').replace(/\$/g, "\\$");
};

const getGitCreatedTime = async (filePath: string): Promise<Date> => {
  filePath = sanitizeFilepath(filePath);

  return await new Promise((resolve, reject) => {
    exec(
      `git log --diff-filter=A --format=%ct -- ${filePath}`,
      (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          // Return current date if file hasn't been committed yet
          if (!stdout) {
            resolve(new Date());
          }

          resolve(new Date(parseInt(stdout.trim(), 10) * 1000));
        }
      }
    );
  });
};

const getGitLastModifiedTime = async (filePath: string): Promise<Date> => {
  filePath = sanitizeFilepath(filePath);

  return await new Promise((resolve, reject) => {
    exec(`git log -1 --format=%ct -- ${filePath}`, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        // Return current date if file hasn't been committed yet
        if (!stdout) {
          resolve(new Date());
        }

        resolve(new Date(parseInt(stdout.trim(), 10) * 1000));
      }
    });
  });
};

export const getCreatedDate = cache(async (filePath: string) => {
  return await getGitCreatedTime(filePath);
});

export const getLastModifiedDate = cache(async (filePath: string) => {
  return await getGitLastModifiedTime(filePath);
});

export const getMostRecentCreatedDate = cache(async (files: string[]) => {
  const dates = await Promise.all(files.map(getCreatedDate));

  return new Date(Math.max(...dates.map((date) => date.getTime())));
});

export const getMostRecentModifiedDate = cache(async (files: string[]) => {
  const dates = await Promise.all(files.map(getLastModifiedDate));

  return new Date(Math.max(...dates.map((date) => date.getTime())));
});
