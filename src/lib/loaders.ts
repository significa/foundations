import type { Loader } from "astro/loaders";
import { glob, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { titleCaseToKebabCase } from "@/lib/utils/strings";

type PreviewLoaderOptions = {
  pattern: `${string}.tsx`;
  base?: string;
};

function extractNamedExports(source: string): string[] {
  const EXPORT_REGEX = /^export\s+(?:const|function|class|async\s+function)\s+([A-Z][a-zA-Z0-9_]*)/gm;
  return Array.from(source.matchAll(EXPORT_REGEX), (match) => match[1]);
}

export const previewLoader = ({ pattern, base }: PreviewLoaderOptions) => {
  return {
    name: "preview-loader",
    // TODO: watch files
    load: async ({ store, parseData }) => {
      const baseDir = resolve(base || "/src");

      for await (const match of glob(pattern, { cwd: baseDir })) {
        const absolutePath = resolve(baseDir, match);
        const slug = match.replace(/\/preview\.tsx$/, "");

        const source = await readFile(absolutePath, "utf-8");
        const exports = extractNamedExports(source);

        for (const exportName of exports) {
          const kebabCaseName = titleCaseToKebabCase(exportName);
          const id = `${slug}/${kebabCaseName}`;

          const data = await parseData({
            id,
            data: {
              // Store the file path relative to the base directory for easier reference
              file: absolutePath.replace(/^.*?(?=\/src\/)/, ""),
              exportName,
            },
          });

          store.set({ id, data });
        }
      }
    },
  } satisfies Loader;
};
