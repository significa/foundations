import type { Loader } from "astro/loaders";
import { glob } from "node:fs/promises";
import { resolve } from "node:path";

type PreviewLoaderOptions = {
  pattern: `${string}.tsx`;
  base?: string;
  generateId?: (options: { entry: string }) => string;
};

export const previewLoader = ({ pattern, base, generateId }: PreviewLoaderOptions) => {
  return {
    name: "preview-loader",
    // TODO: watcher
    load: async ({ store, parseData }) => {
      const baseDir = resolve(base || "./");

      for await (const match of glob(pattern, { cwd: baseDir })) {
        const absolutePath = resolve(baseDir, match);
        const id = generateId?.({ entry: match }) || match;

        const data = await parseData({
          id,
          data: { filePath: absolutePath },
        });

        store.set({ id, data });
      }
    },
  } satisfies Loader;
};
