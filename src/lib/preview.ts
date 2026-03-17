import type { Loader } from "astro/loaders";
import { glob, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";

type PreviewLayout = "centered" | "fullscreen" | "padded";

type PreviewMeta = {
  layout?: PreviewLayout;
};

type PreviewLoaderOptions = {
  pattern: `${string}.tsx`;
  base?: string;
  generateId?: (options: { entry: string }) => string;
};

const PREVIEW_LAYOUTS: PreviewLayout[] = ["centered", "fullscreen", "padded"];

const resolveMetadata = async (absolutePath: string): Promise<PreviewMeta> => {
  try {
    const raw = await readFile(absolutePath, "utf-8");

    // Match the object literal from `const meta = { ... }` (any export style)
    const match = raw.match(/\bmeta\s*=\s*(\{[\s\S]*?\})/m);
    if (!match) return {};

    // Safely evaluate just the object literal as an expression in an isolated context
    const result = runInNewContext(`(${match[1]})`);
    if (result && typeof result === "object" && !Array.isArray(result)) {
      const meta: PreviewMeta = {};

      if ("layout" in result && PREVIEW_LAYOUTS.includes(result.layout as PreviewLayout)) {
        meta.layout = result.layout as PreviewLayout;
      } else if ("layout" in result) {
        console.warn(`Invalid layout "${result.layout}" in ${absolutePath}. Expected one of: ${PREVIEW_LAYOUTS.join(", ")}`);
      }

      return meta;
    }
  } catch (error) {
    console.error(`Error reading metadata from ${absolutePath}:`, error);
  }

  return {};
};

const previewLoader = ({ pattern, base, generateId }: PreviewLoaderOptions) => {
  return {
    name: "preview-loader",
    // TODO: watch files
    load: async ({ store, parseData }) => {
      const baseDir = resolve(base || "/src");

      for await (const match of glob(pattern, { cwd: baseDir })) {
        const absolutePath = resolve(baseDir, match);
        const id = generateId?.({ entry: match }) ?? match;
        const meta = await resolveMetadata(absolutePath);

        const data = await parseData({
          id,
          data: {
            // Store the file path relative to the base directory for easier reference
            file: absolutePath.replace(/^.*?(?=\/src\/)/, ""),
            meta,
          },
        });

        store.set({ id, data });
      }
    },
  } satisfies Loader;
};

export { previewLoader };
export type { PreviewMeta, PreviewLayout };
