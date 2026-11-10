import { exec } from "node:child_process";

const cache = {
  created: new Map<string, string>(),
  modified: new Map<string, string>(),
};

const getGitCreateTime = async (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cached = cache.created.get(filePath);

    if (cached) {
      return resolve(cached);
    }

    exec(`git log --diff-filter=A --follow --format="%cI" -1 "${filePath}"`, (error, stdout) => {
      if (error) {
        return reject(error);
      }

      cache.created.set(filePath, stdout.trim());
      return resolve(stdout.trim());
    });
  });
};

const getGitLastModifiedTime = async (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cached = cache.modified.get(filePath);

    if (cached) {
      return resolve(cached);
    }

    exec(`git log -1 --pretty="format:%cI" "${filePath}"`, (error, stdout) => {
      if (error) {
        return reject(error);
      }

      cache.modified.set(filePath, stdout.trim());
      return resolve(stdout.trim());
    });
  });
};

/** Short sha of the last commit touching any of the files, or null when history is unavailable. */
const getGitLastCommitShortSha = async (filePaths: string[]): Promise<string | null> => {
  const quoted = filePaths.map((filePath) => `"${filePath}"`).join(" ");

  return new Promise((resolve) => {
    exec(`git log -1 --pretty="format:%h" -- ${quoted}`, (error, stdout) => {
      resolve(error ? null : stdout.trim() || null);
    });
  });
};

export { getGitCreateTime, getGitLastCommitShortSha, getGitLastModifiedTime };
