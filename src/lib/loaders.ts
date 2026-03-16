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
    // TODO: watch files
    load: async ({ store, parseData }) => {
      const baseDir = resolve(base || "/src");

      for await (const match of glob(pattern, { cwd: baseDir })) {
        const absolutePath = resolve(baseDir, match);
        const id = generateId?.({ entry: match }) ?? match;

        const data = await parseData({
          id,
          data: {
            // Store the file path relative to the base directory for easier reference
            file: absolutePath.replace(/^.*?(?=\/src\/)/, ""),
          },
        });

        store.set({ id, data });
      }
    },
  } satisfies Loader;
};
