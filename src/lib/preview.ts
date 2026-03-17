import type { Loader } from "astro/loaders";
import { glob, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import z from "zod";

const previewMetaSchema = z.object({
  layout: z.literal(["centered", "fullscreen", "padded"]).optional(),
  mode: z.literal(["inline", "iframe"]).optional(),
});

type PreviewMeta = z.infer<typeof previewMetaSchema>;

type PreviewLayout = NonNullable<PreviewMeta["layout"]>;
type PreviewMode = NonNullable<PreviewMeta["mode"]>;

type PreviewLoaderOptions = {
  pattern: `${string}.tsx`;
  base?: string;
  generateId?: (options: { entry: string }) => string;
};

const resolvePreviewMeta = async (filePath: string): Promise<PreviewMeta> => {
  try {
    const raw = await readFile(filePath, "utf-8");

    const match = raw.match(/\bmeta\s*=\s*(\{[\s\S]*?\})/m);
    if (!match) return {};

    const result = runInNewContext(`(${match[1]})`);
    const parsed = previewMetaSchema.safeParse(result);

    if (parsed.success) return parsed.data;

    console.warn(`Invalid meta in ${filePath}:`, parsed.error.flatten().fieldErrors);
  } catch (error) {
    console.error(`Error reading meta from ${filePath}:`, error);
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

        const meta = await resolvePreviewMeta(absolutePath);

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

export { previewLoader, previewMetaSchema };
export type { PreviewMeta, PreviewLayout, PreviewMode };
